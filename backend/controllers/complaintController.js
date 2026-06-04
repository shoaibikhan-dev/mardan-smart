const Complaint = require('../models/Complaint');
const User      = require('../models/User');
const path      = require('path');

// ── Helpers ──────────────────────────────────────────────────────────────────
const generateTrackingId = () =>
  'MSC-' + Math.random().toString(36).substring(2, 8).toUpperCase();

const buildImageUrl = (req, file) =>
  file ? `${req.protocol}://${req.get('host')}/uploads/${file.filename}` : null;

// ── @desc  Create a new complaint  POST /api/complaints  Private ─────────────
exports.createComplaint = async (req, res) => {
  const { title, description, category, priority, location } = req.body;

  if (!title || !description || !category)
    return res.status(400).json({ success: false, message: 'Title, description and category are required.' });

  try {
    const trackingId = generateTrackingId();
    const imageUrl   = buildImageUrl(req, req.file);

    const complaint = await Complaint.create({
      title:       title.trim(),
      description: description.trim(),
      category,
      priority:    priority || 'medium',
      location:    location?.trim() || null,
      imageUrl,
      trackingId,
      userId:      req.user.id,
    });

    res.status(201).json({ success: true, data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @desc  Get all complaints (admin + filter)  GET /api/complaints  Admin ───
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, category, priority, search, page = 1, limit = 10, sortBy = 'createdAt', order = 'DESC' } = req.query;
    const { Op } = require('sequelize');
    const where  = {};

    if (status)   where.status   = status;
    if (category) where.category = category;
    if (priority) where.priority = priority;
    if (search)   where.title    = { [Op.iLike]: `%${search}%` };

    const { count, rows } = await Complaint.findAndCountAll({
      where,
      include: [{ model: User, as: 'citizen', attributes: ['id', 'name', 'email', 'phone'] }],
      order:   [[sortBy, order.toUpperCase()]],
      limit:   parseInt(limit),
      offset:  (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({
      success:    true,
      total:      count,
      page:       parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      data:       rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @desc  Get single complaint  GET /api/complaints/:id  Private ─────────────
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id, {
      include: [{ model: User, as: 'citizen', attributes: ['id', 'name', 'email', 'phone'] }],
    });
    if (!complaint)
      return res.status(404).json({ success: false, message: 'Complaint not found.' });

    if (req.user.role === 'citizen' && complaint.userId !== req.user.id)
      return res.status(403).json({ success: false, message: 'Access denied.' });

    res.json({ success: true, data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @desc  Update complaint status  PATCH /api/complaints/:id  Admin ──────────
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, priority, adminNote } = req.body;
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint)
      return res.status(404).json({ success: false, message: 'Complaint not found.' });

    const validStatuses  = ['pending', 'in_progress', 'resolved', 'rejected'];
    const validPriorities = ['low', 'medium', 'high', 'urgent'];

    if (status   && validStatuses.includes(status))    complaint.status   = status;
    if (priority && validPriorities.includes(priority)) complaint.priority = priority;
    if (adminNote !== undefined)                        complaint.adminNote = adminNote;
    if (status === 'resolved' && !complaint.resolvedAt) complaint.resolvedAt = new Date();

    await complaint.save();
    res.json({ success: true, data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @desc  Delete complaint  DELETE /api/complaints/:id  Admin ───────────────
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint)
      return res.status(404).json({ success: false, message: 'Complaint not found.' });

    // Delete associated image file if it exists
    if (complaint.imageUrl) {
      const fs   = require('fs');
      const pth  = require('path');
      const file = pth.join(__dirname, '..', 'uploads', pth.basename(complaint.imageUrl));
      if (fs.existsSync(file)) fs.unlinkSync(file);
    }

    await complaint.destroy();
    res.json({ success: true, message: 'Complaint deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @desc  Public complaint tracker  GET /api/complaints/track/:id  Public ───
exports.trackComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      where:      { trackingId: req.params.trackingId.toUpperCase() },
      attributes: ['id', 'title', 'description', 'category', 'status', 'priority',
                   'location', 'trackingId', 'imageUrl', 'createdAt', 'resolvedAt'],
    });
    if (!complaint)
      return res.status(404).json({ success: false, message: 'No complaint found with this tracking ID.' });

    res.json({ success: true, data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @desc  Citizen's own complaints  GET /api/complaints/my  Private ─────────
exports.getUserComplaints = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const where = { userId: req.user.id };
    if (status)   where.status   = status;
    if (category) where.category = category;

    const { count, rows } = await Complaint.findAndCountAll({
      where,
      order:  [['createdAt', 'DESC']],
      limit:  parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({
      success:    true,
      total:      count,
      page:       parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      data:       rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── @desc  Complaint statistics  GET /api/complaints/stats  Private ───────────
exports.getStats = async (req, res) => {
  try {
    const { Op, fn, col, literal } = require('sequelize');
    const where = req.user && req.user.role === 'citizen' ? { userId: req.user.id } : {};

    const [total, pending, inProgress, resolved, rejected] = await Promise.all([
      Complaint.count({ where }),
      Complaint.count({ where: { ...where, status: 'pending' } }),
      Complaint.count({ where: { ...where, status: 'in_progress' } }),
      Complaint.count({ where: { ...where, status: 'resolved' } }),
      Complaint.count({ where: { ...where, status: 'rejected' } }),
    ]);

    res.json({
      success: true,
      data: { total, pending, inProgress, resolved, rejected },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
