const http = require('http');

async function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.request({ host: 'localhost', port, path: '/health', method: 'GET', timeout: 1000 }, (res) => {
      resolve({ port, status: res.statusCode, ok: true });
    });
    req.on('error', () => resolve({ port, ok: false }));
    req.on('timeout', () => { req.destroy(); resolve({ port, ok: false }); });
    req.end();
  });
}

async function probeAll() {
  console.log('Probing ports 8080 to 8099...');
  for (let port = 8080; port <= 8099; port++) {
    const r = await checkPort(port);
    if (r.ok) {
      console.log(`Port ${port}: ACTIVE (Status ${r.status})`);
    }
  }
  console.log('Done probing.');
}

probeAll();
