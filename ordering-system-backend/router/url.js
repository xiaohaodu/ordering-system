const express = require('express')
const router = express.Router()
const url = require('../router_handler/url')
router.post('/url', url.getUrl)
module.exports = router