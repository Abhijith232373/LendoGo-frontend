const http = require('http');

function testRoute(path) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path: path,
      method: 'GET',
    }, (res) => {
      resolve({ path, status: res.statusCode });
    });
    req.on('error', (e) => resolve({ path, error: e.message }));
    req.end();
  });
}

async function main() {
  console.log(await testRoute('/api/feedback/admin'));
  console.log(await testRoute('/api/feedback/admin/'));
  console.log(await testRoute('/api/admin/feedback'));
  console.log(await testRoute('/api/admin/feedbacks'));
}

main();
