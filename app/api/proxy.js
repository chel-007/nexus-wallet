// pages/api/proxy.js

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = createProxyMiddleware({
    target: 'https://webhook.site/39081dc0-4d67-4cf3-8e45-31c1df4dc4c2', // Replace with your webhook.site URL
    changeOrigin: true, // Important for CORS handling
    pathRewrite: { '^/api/notifications': '/' }, // Adjust path mapping if needed
});
