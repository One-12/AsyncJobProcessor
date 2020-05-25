const postCollection = require('../post/post.entity');
const UploadService = require('./upload.service');

exports.imageProcess = async (job) => {
  const data = job.data;
  if (!data) {
    return;
  }
  
  console.log('this is data', data);
  const post = await postCollection.findById(data.postId);
  console.log('this ss is data', post);
  if (post.type != 'image') {
    return;
  }

  console.log('kedacha is data', post);

  const service = new UploadService();
  await service.resizeAndUploadPost(post);
};
