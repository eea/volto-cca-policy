// Mock for node:crypto protocol — redirects to the real Node.js crypto built-in
// Used by Jest 26 which doesn't understand the 'node:' protocol prefix
module.exports = require('crypto');
