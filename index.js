var express = require('express')
var app = express()

app.use(express.static('./src/'));
app.get('/', (req, res) => {
    res.sendFile('./src/index.html');
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
app.listen(port);
