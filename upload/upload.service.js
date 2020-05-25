const shortid = require('shortid');
const sharp = require('sharp');
const axios = require('axios');
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');
const InterceptorUtil = require('../utils/interceptor.util');
const postEntity = require('../post/post.entity');

const STORAGE_ACCOUNT_NAME = 'one12storage';
const ACCOUNT_ACCESS_KEY = '43Unob3jBoZmMwwOb6qzuGbf05TcGw/P0DNlSOK8QA9se+UyE6Wm6YJzWhFTHEq9CjIwacFLZcCiOBplLQFTUQ==';

/**
 * UploadService for uploading contents to Azure Storage service.
 *
 * @class UploadService
 */
class UploadService {
  /**
   * Creates an instance of UploadService.
   * @memberof UploadService
   */
  constructor() {
    const sharedKeyCredential = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
    this._blobServiceClient = new BlobServiceClient(
      `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
      sharedKeyCredential,
    );
    this._interceptorUtil = new InterceptorUtil();
  }

  /**
   * Uploads content so Azure Blob Storage.
   *
   * @param {*} post
   * @memberof UploadService
   */
  async resizeAndUploadPost(post) {
    console.log('resizing started');
    this._containerClient = this._blobServiceClient.getContainerClient(post.userId);

    if (!(await this._containerClient.exists())) {
      this._containerClient = (
        await this._blobServiceClient.createContainer(userId, { access: 'blob' })
      ).containerClient;
    }

    const imgUrl = post.content;
    console.log(imgUrl);
    const imageContent = await axios.get(imgUrl, { responseType: 'arraybuffer' });
    const absFile = imgUrl.split(`/`).pop().split(`.`);

    const name = absFile[0].toLowerCase();
    const fileExt = absFile[1].toLowerCase();

    const fileName = `${name}.${fileExt}`;

    const image300 = await this._innerResizeAndUpload(fileName, imageContent.data, 300);
    const image500 = await this._innerResizeAndUpload(fileName, imageContent.data, 500);

    const resizedImages = [
      { size: 300, content: image300 },
      { size: 500, content: image500 },
    ];
    await postEntity.findOneAndUpdate({ _id: post._id }, { resImages: resizedImages });
    console.log('post content successfully resized and uploaded');
  }

  /**
   * private method to perform resize and upload.
   * @param {*} fileName
   * @param {*} imageContent
   * @param {*} size
   * @return {*} resizedImageUrl
   * @memberof UploadService
   */
  async _innerResizeAndUpload(fileName, imageContent, size) {
    const genFileName = `${shortid.generate()}-${size}-${fileName}`;
    const resizedBuffer = await sharp(imageContent)
      .jpeg({ quality: 100, progressive: true })
      .resize(size)
      .toBuffer({ resolveWithObject: true });
    const uploadBlobResponse = await this._containerClient.uploadBlockBlob(
      genFileName,
      resizedBuffer.data,
      resizedBuffer.info.size,
    );

    return uploadBlobResponse.blockBlobClient.url;
  }
}

module.exports = UploadService;
