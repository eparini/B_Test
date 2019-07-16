var bodyParser = require("body-parser");
var express = require("express");
var app = express();

//Use for store data
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./storage');
}

//Settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.all("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

//Startup
app.get('/', (req, res) => {
    res.send('Server up and running!');
});

//Get
app.post('/gettokens', (req, res) => {
    var tokens = localStorage.getItem(req.body.username);
    res.json(JSON.parse(tokens));
});

//Post
app.post('/savetokens', (req, res) => {
    var tokenToSave = req.body.userTokens;
    localStorage.removeItem(req.body.username);
    localStorage.setItem(req.body.username, JSON.stringify(Array.from(new Set(tokenToSave))));
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});