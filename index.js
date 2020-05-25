require('./dbconnector');
const config = require(__dirname + '/config');
const Queue = require('bull');

const tagProcessor = require('./tag/tags.processor');
const uploadProcessor = require('./upload/upload.processor');

const redisConfig = {
  redis: {
    port: config.job.port,
    host: config.job.host,
  },
};

const uploadPoolQueue = new Queue(config.job.uploadPool, redisConfig);

uploadPoolQueue.process(function (job) {
  console.log('resize and upload processing');
  uploadProcessor.imageProcess(job);
});

const tagPoolQueue = new Queue(config.job.tagPool, redisConfig);

tagPoolQueue.process(function (job) {
  console.log('data processing');
  return tagProcessor.tagProcess(job);
});
