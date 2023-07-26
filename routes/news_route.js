const express = require("express");
const router = express.Router();
const getBitcoinNews = require('../service')

router.get("/news/bitcoin", async (req, res) => {
    await getBitcoinNews(req, res);
})

module.exports = router;