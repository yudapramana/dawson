'use strict'
const cache = require('./../lib/cache'),
  express = require('express'),
  router = express.Router(),
  controllers = require('../controllers'),
  { initialize } = require('../whatsapp'),
  { sendBlastMessage } = require('../controllers/blast'),
  {
    checkDestination,
    checkConnectionBeforeBlast,
  } = require('../lib/middleware')
router.get('/', (_0x1b4eff, _0x5dca07) => {
  const _0x121e7c = require('path')
  _0x5dca07.sendFile(_0x121e7c.join(__dirname, '../../public/index.html'))
})
router.post('/backend-logout', controllers.deleteCredentials)
router.post('/backend-generate-qr', controllers.createInstance)
router.post('/backend-initialize', initialize)
router.post('/backend-send-list', checkDestination, controllers.sendListMessage)
router.post(
  '/backend-send-template',
  checkDestination,
  controllers.sendTemplateMessage
)
router.post(
  '/backend-send-button',
  checkDestination,
  controllers.sendButtonMessage
)
router.post('/backend-send-media', checkDestination, controllers.sendMedia)
router.post('/backend-send-text', checkDestination, controllers.sendText)
router.post('/backend-send-poll', checkDestination, controllers.sendPoll)
router.post('/backend-getgroups', controllers.fetchGroups)
router.post('/backend-blast', checkConnectionBeforeBlast, sendBlastMessage)
router.post('/backend-clearCache', async (_0x3d9699, _0x502c50) => {
  return (
    await cache.myCache.flushAll(),
    console.log('Cache cleared'),
    _0x502c50.json({ status: 'success' })
  )
})
module.exports = router
