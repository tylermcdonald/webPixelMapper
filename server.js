//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan'),
	io = require('socket.io'),
	fs = require('fs');
	
var http = require('http').Server(app);

Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
	
var count = 0;
var people_hash = {};
var image_file = JSON.parse(fs.readFileSync("data1.json","utf8"));

var rate = 1000;
var width = 20;
var height = 20;
var x_offset = 0;
var y_offset = 0;

var used = 0;
var used_y = {};
var pixels = [[],[],[]];

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function withinBounds(locat){
		if(locat.x < width && locat.y < height){
				return true;
		}
		console.log("A");
		return false;
	}

function seatInUse(locat){
	return (used[locat.x][locat.y]);
}
function isSeatValid(locat){
	if(isNumeric(locat.x) && isNumeric(locat.y) && withinBounds(locat) && !seatInUse(locat)){
		return true;
	}
	return false;
}

function zeros(dimensions) {
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }

    return array;
}

function initial(){
	rate = image_file.meta.rate;
	width = image_file.meta.width;
	height = image_file.meta.height;
	x_offset = image_file.meta.topleft.x;
	y_offset = image_file.meta.topleft.y;
	pixels = zeros([height,width]);
	used = zeros([height,width]);
	console.log(width);
	for(var i = 0; i < width*height; i++){
		pixels[i%width][Math.floor(i/width)] = image_file.pixels[i];
		used[i%width][Math.floor(i/width)] = false;
	}
}
initial();
    //mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
   // mongoURLLabel = "";

/*if (mongoURL == null) {
  var mongoHost, mongoPort, mongoDatabase, mongoPassword, mongoUser;
  // If using plane old env vars via service discovery
  if (process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
    mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'];
    mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'];
    mongoDatabase = process.env[mongoServiceName + '_DATABASE'];
    mongoPassword = process.env[mongoServiceName + '_PASSWORD'];
    mongoUser = process.env[mongoServiceName + '_USER'];

  // If using env vars from secret from service binding  
  } else if (process.env.database_name) {
    mongoDatabase = process.env.database_name;
    mongoPassword = process.env.password;
    mongoUser = process.env.username;
    var mongoUriParts = process.env.uri && process.env.uri.split("//");
    if (mongoUriParts.length == 2) {
      mongoUriParts = mongoUriParts[1].split(":");
      if (mongoUriParts && mongoUriParts.length == 2) {
        mongoHost = mongoUriParts[0];
        mongoPort = mongoUriParts[1];
      }
    }
  }

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
  }
}*/
/*
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};*/

app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  /*if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: Date.now()});
    col.count(function(err, count){
      if (err) {
        console.log('Error running count. Message:\n'+err);
      }
      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
    });
  } else {
    */res.render('index.html');
  //}
});

/*app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});
*/
// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});
/*
initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});
*/
app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
