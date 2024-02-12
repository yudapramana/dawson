const wa = require('../whatsapp'),
  { formatReceipt } = require('./helper'),
  checkDestination = async (_0x5245c8, _0x46c42c, _0x3ecf4e) => {
    const { token: _0x57375f, number: _0x4a0670 } = _0x5245c8.body
    if (_0x57375f && _0x4a0670) {
      const _0x3e61a4 = await wa.isExist(_0x57375f, formatReceipt(_0x4a0670))
      if (!_0x3e61a4) {
        return _0x46c42c.send({
          status: false,
          message:
            'The destination Number not registered in WhatsApp or your sender not connected',
        })
      }
      _0x3ecf4e()
    } else {
      _0x46c42c.send({
        status: false,
        message: 'Check your parameter',
      })
    }
  },
  checkConnectionBeforeBlast = async (_0x31500e, _0x59cd22, _0x2e43a6) => {
    const _0x3b2622 = JSON.parse(_0x31500e.body.data),
      _0x31ee7c = await wa.isExist(
        _0x3b2622.sender,
        formatReceipt(_0x3b2622.sender)
      )
    if (!_0x31ee7c) {
      return _0x59cd22.send({
        status: false,
        message: 'Check your whatsapp connection',
      })
    }
    _0x2e43a6()
  }
module.exports = {
  checkDestination: checkDestination,
  checkConnectionBeforeBlast: checkConnectionBeforeBlast,
}
