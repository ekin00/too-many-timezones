// welcome-home-skill.js
// Responds to "welcome" or "hello world" with ASCII art and system info


const os = require('os');

console.log('Platform: ', os.platform());
console.log('Type: ', os.type());
console.log('Release:', os.release());
console.log('Architecture: ', os.arch());
