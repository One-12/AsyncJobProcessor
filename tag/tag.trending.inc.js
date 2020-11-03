const tag = require("./tag.entity");
const user = require('../user/user.entity');
const post = require('../post/post.entity');

exports.tagTrendInc = async job => {
    const data = job.data;
    if (!data || !data.tags || !data.userId) {
        return;
    }
    const userId = data.userId;
    const users = await user.find({ uid: userId });
    const dateToFilter = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (!users && users.length != 0) {
        return;
    }

    const currentUser = users[0];
    const posts = await post.find(
        {
            $and: [
                { userId: userId },
                { postedOn: { $gt: dateToFilter } },]
        }
    );
    const pointsToConsider = currentUser.points;

    if (posts.length > 0) {
        pointsToConsider = pointsToConsider / posts.length;
    }

    const tags = await tag.find({ name: { $in: data.tags.map(tag => tag.toLowerCase()) } });

    const now = new Date();
    const secondsSinceEpoch = Math.round(now.getTime() / 1000);

    tags.forEach(tagToUpdate => {
        await tag.findOneAndUpdate(
            { _id: tagToUpdate._id },
            {
                $inc:
                {
                    hitCount: pointsToConsider * (100000 / (tagToUpdate.lastHit - secondsSinceEpoch))
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
