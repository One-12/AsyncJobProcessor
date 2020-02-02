var tag = require("./tag.entity");

exports.tagProcess = async job => {
  var data = job.data;
  if (!data) {
    return;
  }

  var tags = await tag.find({ name: { $in: data } });

  var availableTags = tags.map(t => t.name.toLowerCase());
  var tagsToCreate = data.filter(d => availableTags.indexOf(d.toLowerCase()) < 0);
  if (tagsToCreate && tagsToCreate.length > 0) {
    var creatingTags = tagsToCreate.map(t => ({
      name: t
    }));
    console.log('creating tags', creatingTags);
    var createdTags = await tag.insertMany(creatingTags);
  }
};
