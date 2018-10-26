// tiny wrapper with default env vars
module.exports = {
  NODE_ENV: process.env.NODE_ENV||"development",
  PORT: 3000,
  // PORT: process.env.PORT || 3000,
  browserClient: process.env.BROWSER_CLIENT || 'firefox'
};
