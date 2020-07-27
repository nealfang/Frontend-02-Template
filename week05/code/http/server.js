const http = require('http')

http.createServer((req, res) => {
  let body = []
  req.on('error', (err) => {
    console.error(err)
  }).on('data', (chunk) => {
    body.push(chunk)
  }).on('end', () => {
    body = Buffer.concat(body).toString()
    console.log("body", body)
    res.writeHead(200, { 'Content-Type': 'text/html' }) // 必写
    // res.end(' Hello World\n')
    res.end(
`<html lang="en">
<head>
  <style>
body div img {
  width: 30px;
  background-color: #cccccc;
}
body div #myid {
  width: 30px;
  background-color: #fff111
}
  </style>
</head>
<body>
  <div>
    <img id="myid" />
    <img />
  </div>
</body>
</html>`)
  })
}).listen(8088)

console.log('server started')