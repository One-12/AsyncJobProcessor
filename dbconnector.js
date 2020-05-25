const config = require(__dirname + '/config');
const mongoose = require('mongoose');
let mongoDB = undefined;

if (typeof mongoDB == 'undefined') {
  // Connects to MongoDb URI.
  mongoose.connect(config.mongo.uri, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });
  mongoDB = mongoose.connection;
  // Error event when the Mongoose fails to connect to MongoDb.
  mongoDB.on('error', function callback() {
    console.log('Error connecting database');
  });
  // Open event when the Mongoose fails to connect to MongoDb.
  mongoDB.once('open', function callback() {
    console.log('Successfully connected to database');
  });
}
