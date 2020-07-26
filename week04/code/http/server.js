const http = require('http')

http.createServer((req, res) => {
  let body = []
  req.on('error', (err) => {
    console.error(err)
  }).on('data', (chunk) => {
    // body.push(chunk.toString())
    body.push(chunk)
  }).on('end', () => {
    body = Buffer.concat(body).toString()
    console.log("body", body)
    res.writeHead(200, { 'Content-Type': 'text/html' }) // 必写
    res.end(' Hello World\n')
  })
}).listen(8088)

console.log('server started')