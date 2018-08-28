const path = require('path');
const express = require('express');
const app = express();

const pathOfIndexHtml = path.resolve('./index.html');

app.get('/', (req, res) => res.sendFile (pathOfIndexHtml));

const pathOfDist = path.resolve('./dist');
const pathOfPublic = path.resolve('./public');

app.use('/dist', express.static(pathOfDist));
app.use('/public', express.static(pathOfPublic));


app.listen(8899, ()=> console.log('App is listening at 8899'));