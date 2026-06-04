import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp-up to 50 users
    { duration: '1m', target: 50 },   // Sustain 50 users
    { duration: '30s', target: 200 }, // Spike to trigger HPA scaling
    { duration: '1m', target: 200 },  // Sustain peak load
    { duration: '30s', target: 0 },   // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
  },
};

export default function () {
  const res = http.get('http://localhost:5000/api/health'); // Replace with Ingress URL in production
  
  check(res, {
    'is status 200': (r) => r.status === 200,
    'uptime is returned': (r) => r.json('status') === 'OK',
  });
  
  sleep(1);
}
