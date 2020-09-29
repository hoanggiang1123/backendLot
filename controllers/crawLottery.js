const { checkQueryCrawler } = require('../helpers/checkParams')
const LotteryCraw = require('../craw')

async function checkFailSaveLottery (urlArr, io) {
  const craw = new LotteryCraw()
  const fail = await craw.saveLotteries(urlArr, io)
  if (fail.length) {
    checkFailSaveLottery(fail)
  }
}

async function get_craw (req, res) {
  const { area , from, to } = checkQueryCrawler(req.query)

  if(area === '' ||from === '' ||  to === '') {
    return res.status(400).json({
      status: 0,
      msg: 'not found'
    })
  }

  res.status(200).json({
    status: 1,
    msg: 'getting lottery...'
  })

  const craw = new LotteryCraw()
  const urlArr = craw.getCrawLotteryUrl(area, from, to);
  if (urlArr.length) {
    try {
      req.io.emit('SERVER_SEND_SAVE_LOTO', { status: 'success', msg: 'Start Getting Lotto' })
      await checkFailSaveLottery(urlArr, req.io)
    } catch (err) {
      console.log(err)
    }
  } else {
    req.io.emit('SERVER_SEND_SAVE_LOTO', { status: 'error', msg: 'Can not get content, pls check area and date' })
  }

}

exports.get_craw = get_craw
