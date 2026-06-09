const Bull = require('bull');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const notificationQueue = new Bull('notifications', {
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  }
});

notificationQueue.process(async (job) => {
  const { complaintId, status, userEmail } = job.data;
  if (!process.env.SMTP_USER || !userEmail) {
    console.log(`📧 [SKIP] No SMTP config or email for complaint ${complaintId}`);
    return;
  }
  await transporter.sendMail({
    from: `"Mardan Smart City" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: `Complaint ${complaintId} — Status Updated to ${status}`,
    html: `
      <h2>Mardan Smart City Complaint Portal</h2>
      <p>Your complaint <strong>${complaintId}</strong> status has been updated to <strong>${status}</strong>.</p>
      <p>Login to your dashboard to view details.</p>
    `,
  });
  console.log(`✅ Email sent to ${userEmail} for complaint ${complaintId}`);
});

notificationQueue.on('completed', (job) => {
  console.log(`✅ Notification sent for job ${job.id}`);
});

notificationQueue.on('failed', (job, err) => {
  console.error(`❌ Notification failed for job ${job.id}:`, err.message);
});

module.exports = { notificationQueue };
