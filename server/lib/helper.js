const {
  default: makeWASocket,
  downloadContentFromMessage,
} = require('@whiskeysockets/baileys')
function formatReceipt(_0x200ec8) {
  try {
    if (_0x200ec8.endsWith('@g.us')) {
      return _0x200ec8
    }
    let _0x266528 = _0x200ec8.replace(/\D/g, '')
    return (
      _0x266528.startsWith('0') && (_0x266528 = '62' + _0x266528.substr(1)),
      !_0x266528.endsWith('@c.us') && (_0x266528 += '@c.us'),
      _0x266528
    )
  } catch (_0x46c8c9) {
    return _0x200ec8
  }
}
async function asyncForEach(_0x4ea03d, _0x4f630c) {
  for (let _0x5bff48 = 0; _0x5bff48 < _0x4ea03d.length; _0x5bff48++) {
    await _0x4f630c(_0x4ea03d[_0x5bff48], _0x5bff48, _0x4ea03d)
  }
}
async function removeForbiddenCharacters(_0x1c0bc7) {
  return _0x1c0bc7.replace(/[^a-zA-Z0-9 #\/:\.\@!\-\u0600-\u06FF]/g, '')
}
async function parseIncomingMessage(_0x34e6e7) {
  const _0x162b4f = Object.keys(_0x34e6e7.message || {})[0],
    _0x29dfd6 =
      _0x162b4f === 'conversation' && _0x34e6e7.message.conversation
        ? _0x34e6e7.message.conversation
        : _0x162b4f == 'imageMessage' && _0x34e6e7.message.imageMessage.caption
        ? _0x34e6e7.message.imageMessage.caption
        : _0x162b4f == 'videoMessage' && _0x34e6e7.message.videoMessage.caption
        ? _0x34e6e7.message.videoMessage.caption
        : _0x162b4f == 'extendedTextMessage' &&
          _0x34e6e7.message.extendedTextMessage.text
        ? _0x34e6e7.message.extendedTextMessage.text
        : _0x162b4f == 'messageContextInfo' &&
          _0x34e6e7.message.listResponseMessage?.title
        ? _0x34e6e7.message.listResponseMessage.title
        : _0x162b4f == 'messageContextInfo'
        ? _0x34e6e7.message.buttonsResponseMessage.selectedDisplayText
        : '',
    _0x55c849 = _0x29dfd6.toLowerCase(),
    _0x17c605 = await removeForbiddenCharacters(_0x55c849),
    _0x129cae = _0x34e6e7?.pushName || '',
    _0x511fb0 = _0x34e6e7.key.remoteJid.split('@')[0]
  let _0x33a83b
  if (_0x162b4f === 'imageMessage') {
    const _0x5f1213 = await downloadContentFromMessage(
      _0x34e6e7.message.imageMessage,
      'image'
    )
    let _0x39fe2e = Buffer.from([])
    for await (const _0x12d040 of _0x5f1213) {
      _0x39fe2e = Buffer.concat([_0x39fe2e, _0x12d040])
    }
    _0x33a83b = _0x39fe2e.toString('base64')
  } else {
    urlImage = null
  }
  return {
    command: _0x17c605,
    bufferImage: _0x33a83b,
    from: _0x511fb0,
  }
}
module.exports = {
  formatReceipt: formatReceipt,
  asyncForEach: asyncForEach,
  removeForbiddenCharacters: removeForbiddenCharacters,
  parseIncomingMessage: parseIncomingMessage,
}
