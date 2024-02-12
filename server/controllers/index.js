'use strict'
const wa = require('../whatsapp'),
  createInstance = async (_0x18de2b, _0x4b494e) => {
    const { token: _0xc0a8 } = _0x18de2b.body
    if (_0xc0a8) {
      try {
        const _0x15887d = await wa.connectToWhatsApp(_0xc0a8, _0x18de2b.io),
          _0x2fa10d = _0x15887d?.status,
          _0x123c3a = _0x15887d?.message
        return _0x4b494e.send({
          status: _0x2fa10d ?? 'processing',
          qrcode: _0x15887d?.qrcode,
          message: _0x123c3a ? _0x123c3a : 'Processing',
        })
      } catch (_0x5a8d22) {
        return (
          console.log(_0x5a8d22),
          _0x4b494e.send({
            status: false,
            error: _0x5a8d22,
          })
        )
      }
    }
    _0x4b494e.status(403).end('Token needed')
  },
  sendText = async (_0x3c0d03, _0x153ca3) => {
    const {
      token: _0x3e940e,
      number: _0x56daf8,
      text: _0x370369,
    } = _0x3c0d03.body
    if (_0x3e940e && _0x56daf8 && _0x370369) {
      const _0x260c2d = await wa.sendText(_0x3e940e, _0x56daf8, _0x370369)
      return handleResponSendMessage(_0x260c2d, _0x153ca3)
    }
    _0x153ca3.send({
      status: false,
      message: 'Check your parameter',
    })
  },
  sendMedia = async (_0xece652, _0x5c4b57) => {
    const {
      token: _0x117741,
      number: _0x3d1173,
      type: _0x58a432,
      url: _0x42df1b,
      caption: _0x825304,
      ptt: _0xa014fe,
      filename: _0x1cef41,
    } = _0xece652.body
    if (_0x117741 && _0x3d1173 && _0x58a432 && _0x42df1b) {
      const _0x12f530 = await wa.sendMedia(
        _0x117741,
        _0x3d1173,
        _0x58a432,
        _0x42df1b,
        _0x825304 ?? '',
        _0xa014fe,
        _0x1cef41
      )
      return handleResponSendMessage(_0x12f530, _0x5c4b57)
    }
    _0x5c4b57.send({
      status: false,
      message: 'Check your parameter',
    })
  },
  sendButtonMessage = async (_0x1be816, _0x539621) => {
    const {
        token: _0xf7dc48,
        number: _0x43f499,
        button: _0x1f5fca,
        message: _0x53bb53,
        footer: _0x57177e,
        image: _0x40b105,
      } = _0x1be816.body,
      _0x45d185 = JSON.parse(_0x1f5fca)
    if (_0xf7dc48 && _0x43f499 && _0x1f5fca && _0x53bb53) {
      const _0x82b1f1 = await wa.sendButtonMessage(
        _0xf7dc48,
        _0x43f499,
        _0x45d185,
        _0x53bb53,
        _0x57177e,
        _0x40b105
      )
      return handleResponSendMessage(_0x82b1f1, _0x539621)
    }
    _0x539621.send({
      status: false,
      message: 'Check your parameterr',
    })
  },
  sendTemplateMessage = async (_0x3b16de, _0x4d47ad) => {
    const {
      token: _0x5c7bbc,
      number: _0x508c90,
      button: _0x3e7fc2,
      text: _0x315eef,
      footer: _0x4a4a5e,
      image: _0x35accc,
    } = _0x3b16de.body
    if (_0x5c7bbc && _0x508c90 && _0x3e7fc2 && _0x315eef && _0x4a4a5e) {
      const _0xf26024 = await wa.sendTemplateMessage(
        _0x5c7bbc,
        _0x508c90,
        JSON.parse(_0x3e7fc2),
        _0x315eef,
        _0x4a4a5e,
        _0x35accc
      )
      return handleResponSendMessage(_0xf26024, _0x4d47ad)
    }
    _0x4d47ad.send({
      status: false,
      message: 'Check your parameter',
    })
  },
  sendListMessage = async (_0x511ace, _0x4d612f) => {
    const {
      token: _0x48dedf,
      number: _0x1a9efe,
      list: _0x25f436,
      text: _0x20c70e,
      footer: _0x4b2187,
      title: _0x987afc,
      buttonText: _0x5806a8,
    } = _0x511ace.body
    if (
      _0x48dedf &&
      _0x1a9efe &&
      _0x25f436 &&
      _0x20c70e &&
      _0x987afc &&
      _0x5806a8
    ) {
      const _0x288c1e = await wa.sendListMessage(
        _0x48dedf,
        _0x1a9efe,
        JSON.parse(_0x25f436),
        _0x20c70e,
        _0x4b2187 ?? '',
        _0x987afc,
        _0x5806a8
      )
      return handleResponSendMessage(_0x288c1e, _0x4d612f)
    }
    _0x4d612f.send({
      status: false,
      message: 'Check your parameterr',
    })
  },
  sendPoll = async (_0x20645c, _0x274328) => {
    const {
      token: _0x47c8ed,
      number: _0x227162,
      name: _0x496577,
      options: _0x287342,
      countable: _0x40eca0,
    } = _0x20645c.body
    if (_0x47c8ed && _0x227162 && _0x496577 && _0x287342 && _0x40eca0) {
      const _0x3d816e = await wa.sendPollMessage(
        _0x47c8ed,
        _0x227162,
        _0x496577,
        JSON.parse(_0x287342),
        _0x40eca0
      )
      return handleResponSendMessage(_0x3d816e, _0x274328)
    }
    _0x274328.send({
      status: false,
      message: 'Check your parameterrs',
    })
  },
  fetchGroups = async (_0x5d6285, _0x44ff24) => {
    const { token: _0x4e2820 } = _0x5d6285.body
    if (_0x4e2820) {
      const _0x4cd722 = await wa.fetchGroups(_0x4e2820)
      return handleResponSendMessage(_0x4cd722, _0x44ff24)
    }
    _0x44ff24.send({
      status: false,
      message: 'Check your parameter',
    })
  },
  deleteCredentials = async (_0x9c92fc, _0x5ae2b9) => {
    const { token: _0x59b245 } = _0x9c92fc.body
    if (_0x59b245) {
      const _0x29742a = await wa.deleteCredentials(_0x59b245)
      return handleResponSendMessage(_0x29742a, _0x5ae2b9)
    }
    _0x5ae2b9.send({
      status: false,
      message: 'Check your parameter',
    })
  },
  handleResponSendMessage = (_0x38364f, _0x257ff5, _0x9e0a82 = null) => {
    if (_0x38364f) {
      return _0x257ff5.send({
        status: true,
        data: _0x38364f,
      })
    }
    return _0x257ff5.send({
      status: false,
      message: 'Check your whatsapp connection',
    })
  }
module.exports = {
  createInstance: createInstance,
  sendText: sendText,
  sendMedia: sendMedia,
  sendButtonMessage: sendButtonMessage,
  sendTemplateMessage: sendTemplateMessage,
  sendListMessage: sendListMessage,
  deleteCredentials: deleteCredentials,
  fetchGroups: fetchGroups,
  sendPoll: sendPoll,
}
