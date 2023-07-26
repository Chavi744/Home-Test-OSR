const fs = require('fs');
const path = require("path");

const cacheFilePath = path.join(__dirname, 'cache.json');

function saveToCache(key, data) {
    const cacheData = loadCacheData();
    cacheData[key] = {
        data,
        expirationTime: Date.now() + 10 * 60 * 1000 // 10 minutes expiration time
    };
    fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData, null, 2));
}

function searchInCache(key) {
    const cacheData = loadCacheData();
    const cacheEntry = cacheData[key];

    if (cacheEntry && cacheEntry.expirationTime > Date.now()) {
        return cacheEntry.data;
    }

    delete cacheData[key];
    fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData, null, 2));
    return undefined;
}

function loadCacheData() {
    try {
        const cacheData = fs.readFileSync(cacheFilePath, 'utf8');
        return JSON.parse(cacheData);
    } catch (err) {
        // If the file does not exist or is empty, return an empty object
        return {};
    }
}

module.exports = {saveToCache, searchInCache};
