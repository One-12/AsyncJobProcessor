const tag = require("./tag.entity");

exports.tagTrendDec = async job => {
    const data = job.data;
    if (!data) {
        return;
    }

    const tags = await tag.find({ name: { $in: data.map(tag => tag.toLowerCase()) } });

    const now = new Date()
    const secondsSinceEpoch = Math.round(now.getTime() / 1000)

    tags.forEach(tagToUpdate => {
        await tag.findOneAndUpdate(
            { _id: tagToUpdate._id },
            {
                $inc:
                {
                    hitCount: -((tagToUpdate.lastHit - secondsSinceEpoch) / 10000)
                },
            });
    });

    tags.forEach(tagToUpdate => {
        await tag.findOneAndUpdate(
            { _id: tagToUpdate._id },
            {
                lastHit: secondsSinceEpoch,
            });
    });
}
