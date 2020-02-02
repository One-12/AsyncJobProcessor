var db = require("./dbconnector"),
  path = require("path"),
  config = require(__dirname + "/config"),
  queue = require("bull");

var tagProcessor = require("./tag/tags.processor");

const redisConfig = {
  redis: {
    port: config.job.port,
    host: config.job.host,
    password: config.job.password
  }
};

var tagPoolQueue = new queue(config.job.tagPool, redisConfig);

tagPoolQueue.process(function(job) {
  console.log('data processing');
  return tagProcessor.tagProcess(job);
});
