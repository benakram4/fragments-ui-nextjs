// utilities\validTypes.js

// fragment Valid Types 
const validTypes = new Map([
  ['text/plain', true],
  [`text/markdown`, true],
  [`text/html`, true],
  [`application/json`, true],
  [`image/png`, false],
  [`image/jpeg`, false],
  [`image/webp`, false],
  [`image/gif`, false],
])

export default validTypes;