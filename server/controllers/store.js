'use strict'
const fs = require('fs'),
  chats = (_0x5ba3ab, _0x14d4e1) => {
    const { token: _0x1fc1c1, type: _0x183b08, jid: _0x7e6329 } = _0x5ba3ab.body
    if (_0x1fc1c1 && _0x183b08) {
      try {
        const _0x26834e = fs.readFileSync(
          'credentials/' + _0x1fc1c1 + '/multistore.js',
          { encoding: 'utf8' }
        )
        let _0x317b17 = JSON.parse(_0x26834e)
        if (_0x183b08 === 'chats') {
          _0x317b17 = _0x317b17.chats
        } else {
          if (_0x183b08 === 'contacts') {
            _0x317b17 = _0x317b17.contacts
          } else {
            if (_0x183b08 === 'messages') {
              _0x7e6329
                ? (_0x317b17 = _0x317b17.messages[_0x7e6329])
                : (_0x317b17 = _0x317b17.messages)
            } else {
              return _0x14d4e1.send({
                status: false,
                message: 'Unknown type',
              })
            }
          }
        }
        if (typeof _0x317b17 === 'undefined') {
          return _0x14d4e1.send({
            status: false,
            message: 'Data Not Found',
          })
        }
        return _0x14d4e1.send(
          _0x317b17.length > 0 ? _0x317b17.reverse() : _0x317b17
        )
      } catch (_0x56f938) {
        return (
          process.env.NODE_ENV !== 'production' ? console.log(_0x56f938) : null,
          _0x14d4e1.send({
            status: false,
            error: _0x56f938,
          })
        )
      }
    }
    _0x14d4e1.send({
      status: false,
      error: 'wrong parameters',
    })
  }
module.exports = { chats: chats }
