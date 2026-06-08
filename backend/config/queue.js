const Bull = require('bull');

const notificationQueue = new Bull('notifications', {
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  }
});

notificationQueue.process(async (job) => {
  const { complaintId, status, userEmail } = job.data;
  console.log(`📧 Sending notification for complaint ${complaintId} - Status: ${status} to ${userEmail}`);
});

notificationQueue.on('completed', (job) => {
  console.log(`✅ Notification sent for job ${job.id}`);
});

notificationQueue.on('failed', (job, err) => {
  console.error(`❌ Notification failed for job ${job.id}:`, err.message);
});

module.exports = { notificationQueue };
