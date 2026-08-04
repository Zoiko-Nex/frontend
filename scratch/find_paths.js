const fs = require('fs');
let content = fs.readFileSync('app/Super-admin/page.tsx', 'utf8');
let paths = [...content.matchAll(/\/v1\/[a-zA-Z0-9_-]+/g)];
let uniquePaths = new Set();
paths.forEach(p => uniquePaths.add(p[0]));
console.log('Unique paths found:');
uniquePaths.forEach(p => console.log(p));
