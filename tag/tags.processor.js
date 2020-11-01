const tag = require("./tag.entity");
const tagTrend = require('./tag.trending.inc');

exports.tagProcess = async job => {
  const data = job.data;
  if (!data || !data.tags || !data.userId) {
    return;
  }

  const now = new Date();
  const secondsSinceEpoch = Math.round(now.getTime() / 1000);

  const tags = await tag.find({ name: { $in: data.tags } });

  const availableTags = tags.map(t => t.name.toLowerCase());
  const tagsToCreate = data.tags.filter(d => availableTags.indexOf(d.toLowerCase()) < 0);
  const tagsToUpdate = data.tags.filter(d => availableTags.indexOf(d.toLowerCase()) >= 0);

  if (tagsToCreate && tagsToCreate.length > 0) {
    const creatingTags = tagsToCreate.map(t => ({
      name: t,
      lastHit: secondsSinceEpoch
    }));
    console.log('creating tags', creatingTags);
    await tag.insertMany(creatingTags);
  }

  if (tagsToUpdate && tagsToUpdate.length > 0) {
    await tagTrend.tagTrendInc({ tags: tagsToUpdate, userId: data.userId });
  }
};
