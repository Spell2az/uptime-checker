const http = require('http');

const port = 8080;

const server = http.createServer((req, res) => {
  res.end('Wassssup!');
});

server.listen(port, (err) => {
  console.log(`Server is listening on port: ${port}`);
})