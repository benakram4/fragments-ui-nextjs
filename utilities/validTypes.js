// utilities\validTypes.js

// fragment Valid Types 
const validTypes = new Map([
  ['text/plain', true],
  [`text/markdown`, false],
  [`text/html`, false],
  [`application/json`, false],
  [`image/png`, false],
  [`image/jpeg`, false],
  [`image/webp`, false],
  [`image/gif`, false],
])

export default validTypes;