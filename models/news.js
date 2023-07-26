const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    author: {
        type: String,
    },
    publishedAt: {
        type: Date,
    },
    publishedAtString: {
        type: String,
    }
});

const News = mongoose.model('News', newsSchema, 'news1');
module.exports = News;