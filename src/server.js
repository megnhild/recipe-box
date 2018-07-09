// Set up server and listen on port

//sets up express app to serve static files
const path = require('path');
//pulls in needed modules
const express = require('express');
const config = require('./config');
//creates application object
const app = express();

const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

app.use('/doc', function(req, res, next) {
    res.end(`Documentation http://expressjs.com/`);
});

app.use(function(req, res, next) {
    res.end("Hello World!");
});

//starts server
app.listen(config.port, function() {
    console.log(`${config.appName} is listening on port ${config.port}`);
});