// We will declare all our dependencies here

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const path = require('path');
const config = require('./config/database');
const kadryRoutes = require('./controllers/kadry');
const pracownikRoutes = require('./controllers/pracownik');
const publikacjaRoutes = require('./controllers/publikacja');

//Connect to Database
mongoose.connect(config.database);

//Initialize our app variable
const app = express();

//Declaring Port
const port = 3000;

//Middleware for CORS
app.use(cors());

//Middleware for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

/*express.static is a built in middleware function to serve static files.
 We are telling express server public folder is the place to look for the static files
*/
app.use(express.static(path.join(__dirname, 'public')));

app.use('/pracownicy', pracownikRoutes);
app.use('/', kadryRoutes);

//Caches 404 and sends it to index.html (for angular to deal with)
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

//Graceful shutdown
if (process.platform === "win32") {
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}

process.on("SIGINT", function () {
  process.exit();
});
//graceful shutdown end

//Listen to port 3000
app.listen(port, () => {
    console.log(`Starting the server at port ${port}`);
});