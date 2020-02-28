/**
 * Add random latency to server calls from 0 to MAX_LATENCY_IN_MS
 */
const MAX_LATENCY_IN_MS = 3000;

/**
 * Define server error probability between 0 and 1 (send 500 error response in error case)
 */
const ERROR_PROBABILITY = 0;

module.exports = (req, res, next) => setTimeout(() => {
  if (!req.header('Authorization')) {
    res.status(401).send("Unauthorized");
  } else if (Math.random() < ERROR_PROBABILITY) {
    res.status(500).send("Error");
  } else {
    next();
  }
}, Math.floor(Math.random() * MAX_LATENCY_IN_MS));
