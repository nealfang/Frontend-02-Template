let http = require('http')
// let fs = require('fs')
let unzipper = require('unzipper')

http.createServer((req, res) => {

  // const outFile =  fs.createWriteStream('../server/public/tam.zip')

  req.pipe(unzipper.Extract({path: '../server/public'}))

  // req.on('data', chunk => {
  //   outFile.write(chunk)
  // })

  // req.on('end', () => {
  //   outFile.end()
  //   res.end('Success')
  // })
}).listen(8082)