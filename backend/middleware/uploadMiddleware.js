const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const { fileTypeFromBuffer } = require('file-type');

// ── Ensure uploads dir exists ────────────────────────────────────────────────
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ── Disk storage config ──────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `complaint-${unique}${path.extname(file.originalname)}`);
  },
});

// ── File filter: images only ─────────────────────────────────────────────────
const fileFilter = async (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const extOk   = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk  = allowed.test(file.mimetype);
  if (!extOk || !mimeOk) return cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed.'), false);
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

module.exports = upload;
