const { dbQuery } = require('../database/index'),
  { parseIncomingMessage, formatReceipt } = require('../lib/helper')
require('dotenv').config()
const axios = require('axios'),
  {
    isExistsEqualCommand,
    isExistsContainCommand,
    getUrlWebhook,
  } = require('../database/model'),
  IncomingMessage = async (_0x292a07, _0x30729a) => {
    try {
      let _0x49a1b1 = false
      if (!_0x292a07.messages) {
        return
      }
      _0x292a07 = _0x292a07.messages[0]
      const _0x1d8ba1 = _0x292a07?.pushName || ''
      if (_0x292a07.key.fromMe === true) {
        return
      }
      if (_0x292a07.key.remoteJid === 'status@broadcast') {
        return
      }
      const _0x263711 =
          _0x292a07.key.participant && formatReceipt(_0x292a07.key.participant),
        {
          command: _0x571368,
          bufferImage: _0x29ba23,
          from: _0xce35de,
        } = await parseIncomingMessage(_0x292a07)
      let _0x327fda, _0x54cc71
      const _0x59a730 = _0x30729a.user.id.split(':')[0],
        _0x99901a = await isExistsEqualCommand(_0x571368, _0x59a730)
      _0x99901a.length > 0
        ? (_0x54cc71 = _0x99901a)
        : (_0x54cc71 = await isExistsContainCommand(_0x571368, _0x59a730))
      if (_0x54cc71.length === 0) {
        console.log(_0x292a07)
        const _0x5dcb02 = await getUrlWebhook(_0x59a730)
        if (_0x5dcb02 == null) {
          return
        }
        const _0x1c9769 = await sendWebhook({
          command: _0x571368,
          bufferImage: _0x29ba23,
          from: _0xce35de,
          url: _0x5dcb02,
          participant: _0x263711,
        })
        if (_0x1c9769 === false) {
          return
        }
        if (_0x1c9769 === undefined) {
          return
        }
        if (typeof _0x1c9769 != 'object') {
          return
        }
        _0x49a1b1 = _0x1c9769?.quoted ? true : false
        _0x327fda = JSON.stringify(_0x1c9769)
      } else {
        replyorno =
          _0x54cc71[0].reply_when == 'All'
            ? true
            : _0x54cc71[0].reply_when == 'Group' &&
              _0x292a07.key.remoteJid.includes('@g.us')
            ? true
            : _0x54cc71[0].reply_when == 'Personal' &&
              !_0x292a07.key.remoteJid.includes('@g.us')
            ? true
            : false
        if (replyorno === false) {
          return
        }
        _0x49a1b1 = _0x54cc71[0].is_quoted ? true : false
        _0x327fda =
          process.env.TYPE_SERVER === 'hosting'
            ? _0x54cc71[0].reply
            : JSON.stringify(_0x54cc71[0].reply)
      }
      return (
        (_0x327fda = _0x327fda.replace(/{name}/g, _0x1d8ba1)),
        await _0x30729a
          .sendMessage(_0x292a07.key.remoteJid, JSON.parse(JSON.parse(_0x327fda)), {
            quoted: _0x49a1b1 ? _0x292a07 : null,
          })
          .catch((_0x502d77) => {
            console.log(_0x502d77)
          }),
        true
      )
    } catch (_0x305b63) {
      console.log(_0x305b63)
    }
  }
async function sendWebhook({
  command: _0x5f3017,
  bufferImage: _0x14d9d0,
  from: _0x5accf5,
  url: _0x3b5329,
  participant: _0x4183a9,
}) {
  try {
    const _0x3c8118 = {
        message: _0x5f3017,
        bufferImage: _0x14d9d0 == undefined ? null : _0x14d9d0,
        from: _0x5accf5,
        participant: _0x4183a9,
      },
      _0x145623 = { 'Content-Type': 'application/json; charset=utf-8' },
      _0x10cce9 = await axios
        .post(_0x3b5329, _0x3c8118, _0x145623)
        .catch(() => {
          return false
        })
    return _0x10cce9.data
  } catch (_0x4bc63f) {
    return console.log('error send webhook', _0x4bc63f), false
  }
}
module.exports = { IncomingMessage: IncomingMessage }
