const News = require("./models/news")
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('7dbbcb5294e9491285d91151f5b94fdf');
const moment = require('moment');
const { saveToCache, searchInCache } = require("./cache/cache_functions");
const { saveLastRunDate, getLastRunDate } = require("./date/save_run_date");

module.exports = async function getBitcoinNews(req, res) {

    const queryDate = req.query.date.toString();
    const currentDate = moment(queryDate);
    const currentDateISO = currentDate.toISOString(); // The "current" date
    const startDate = new Date(currentDateISO);
    startDate.setDate(new Date(currentDateISO).getDate() - 30);
    const startDateISO = startDate.toISOString(); // Date of a month ago
    const keyDate = currentDateISO.split('T')[0]; // The current date in "YYYY-MM-DD" format is used as a key to save data in the cache

    // Get the news from cache if it's full
    const dataFromCache = searchInCache(keyDate);
    if (dataFromCache) {
        res.send(dataFromCache);
        console.log("News sent from cache");
        return;
    }

    // (else) Search the news in DB
    const resultsNews = await News.find({ publishedAt: { $gte: startDateISO, $lte: currentDateISO } })
    // Check if the last run date in the current date
    let lastRunDate = getLastRunDate(); // The last run date 
    let firstDate = !isNaN(lastRunDate) ? lastRunDate.toISOString().split('T')[0] : "0000-00-00"
    const lastDate = currentDateISO.split('T')[0];
    if (firstDate === lastDate) {
        handleNews(req, res, keyDate, currentDate, resultsNews)
        console.log("All data sent from DB")
        return;
    }
    // Get the missing days from 'News API' 
    if (resultsNews.length > 0) {
        resultsNews.sort((a, b) => b.publishedAt - a.publishedAt); // Sort resultsNews by their date in descending order (newest to oldest)
        const latestNewsItem = resultsNews.slice(0, 1); // The first object (index 0) from resultsNews
        lastRunDate = latestNewsItem[0].publishedAt; // The date of the latest published date 
        const prevDate = lastRunDate;
        prevDate.setDate(lastRunDate.getDate() + 1);
        const prevDateISO = prevDate.toISOString(); // First date that missing
        let resultsAllNews = [];
        const results = await getNewsFromAPI(req, res, prevDateISO, currentDateISO)
        resultsAllNews = resultsNews.concat(results);
        handleNews(req, res, keyDate, currentDate, resultsAllNews)
        console.log("Data sent from DB and 'News API'")
        return;

    } else {
        // There are not relevant news in DB, get the news from external API
        const results = await getNewsFromAPI(req, res, startDateISO, currentDateISO)
        handleNews(req, res, keyDate, currentDate, results)
        console.log("All data sent from 'News API'")
        return;
    }
}

// Get news from News API
async function getNewsFromAPI(req, res, fromDate, toDate) {
    try {
        const response = await newsapi.v2.everything({
            q: 'bitcoin',
            from: fromDate,
            to: toDate
        });
        if (response) {
            // Transform the array to match the schema
            const transformedNews = response.articles.map((newArticle) => ({
                title: newArticle.title,
                content: newArticle.content,
                author: newArticle.author,
                publishedAt: newArticle.publishedAt,
                publishedAtString: timeAgo(newArticle.publishedAt)
            }));
            saveToCollection(transformedNews);
            return transformedNews;
        }
    } catch (error) {
        res.status(400).send({ 'Error fetching top everything:': error.message })
        throw error;
    };
}

// Save news to collection
async function saveToCollection(newsArticles) {
    News.create(newsArticles)
        .then(() => {
            console.log('News saved successfully');
        })
        .catch((error) => {
            console.error('Error saving news:', error);
        });
}

// Save news to cache, save last run date and send the news
async function handleNews(req, res, keyDate, currentDate, newsArticles) {
    saveToCache(keyDate, newsArticles);
    saveLastRunDate(currentDate);
    res.send(newsArticles);
}

// Return date in “XX minutes|hours|days|weeks ago” format
function timeAgo(date) {
    const currentDate = new Date();
    const timestamp = new Date(date).getTime();
    const currentTimestamp = currentDate.getTime();
    const timeDifference = currentTimestamp - timestamp;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;

    if (timeDifference < minute) {
        return 'Just now';
    } else if (timeDifference < hour) {
        const minutesAgo = Math.floor(timeDifference / minute);
        return `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`;
    } else if (timeDifference < day) {
        const hoursAgo = Math.floor(timeDifference / hour);
        return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
    } else if (timeDifference < week) {
        const daysAgo = Math.floor(timeDifference / day);
        return `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;
    } else {
        const weeksAgo = Math.floor(timeDifference / week);
        return `${weeksAgo} ${weeksAgo === 1 ? 'week' : 'weeks'} ago`;
    }
}