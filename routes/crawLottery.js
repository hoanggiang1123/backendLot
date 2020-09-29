const express = require('express')
const router = express.Router()

const { get_craw } = require('../controllers/crawLottery.js')

router.get('/', get_craw)

module.exports = router
