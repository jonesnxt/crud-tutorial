const path = require('path');
const express = require('express') 
const app = express()

app.use('/', express.static(path.join(__dirname, 'static'), {index: "index.html"}));

app.listen(8080);

console.log('[webpack] Frontend server started (port 8080)');
console.log('webpack built 1b7eb346644fe27981b6 in 4661ms');
console.log('##frontend-built##');

