/**
 * Add random latency to server calls from 0 to MAX_LATENCY_IN_MS
 */
const MAX_LATENCY_IN_MS = 3000;

module.exports = (req, res, next) => setTimeout(() => next(), Math.floor(Math.random() * MAX_LATENCY_IN_MS));
