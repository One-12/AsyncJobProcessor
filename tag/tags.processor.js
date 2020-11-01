const tag = require("./tag.entity");

exports.tagProcess = async job => {
  const data = job.data;
  if (!data) {
    return;
  }

  const now = new Date();
  const secondsSinceEpoch = Math.round(now.getTime() / 1000);

  const tags = await tag.find({ name: { $in: data } });

  const availableTags = tags.map(t => t.name.toLowerCase());
  const tagsToCreate = data.filter(d => availableTags.indexOf(d.toLowerCase()) < 0);
  if (tagsToCreate && tagsToCreate.length > 0) {
    const creatingTags = tagsToCreate.map(t => ({
      name: t,
      lastHit: secondsSinceEpoch
    }));
    console.log('creating tags', creatingTags);
    await tag.insertMany(creatingTags);
  }
};
