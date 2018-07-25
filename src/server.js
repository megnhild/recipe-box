// Set up server and listen on port

const bodyParser = require('body-parser');
//sets up express app to serve static files
const path = require('path');
//pulls in needed modules
const express = require('express');
const config = require('./config');
//so the app knows how to use the router
const router = require('./routes');
// Load mongoose package
const mongoose = require('mongoose');

// Connect to mLab and create/use database as configured
mongoose.connection.openUri(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}/${config.db.dbName}`, { useNewUrlParser: true });

//creates application object
const app = express();

const publicPath = path.resolve(__dirname, '../public');
//tells server to use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(publicPath));
app.use('/api', router);

//starts server
app.listen(config.port, function() {
    console.log(`${config.appName} is listening on port ${config.port}`);
});