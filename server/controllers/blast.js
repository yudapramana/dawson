const { dbQuery } = require('../database'),
  wa = require('../whatsapp')
let inProgress = []
const sendBlastMessage = async (_0x471de4, _0x3b2c01) => {
  const _0x3bf57d = JSON.parse(_0x471de4.body.data),
    _0x1918f5 = _0x3bf57d.data,
    _0xe0ca6d = _0x3bf57d.campaign_id,
    _0x116399 = (_0x4c7b6f) =>
      new Promise((_0x406162) => setTimeout(_0x406162, _0x4c7b6f))
  if (inProgress[_0xe0ca6d]) {
    return (
      console.log(
        'still any progress in campaign id ' +
          _0xe0ca6d +
          ', request canceled. '
      ),
      _0x3b2c01.send({ status: 'in_progress' })
    )
  }
  inProgress[_0xe0ca6d] = true
  console.log('progress campaign ID : ' + _0xe0ca6d + ' started')
  const _0x2767e7 = async () => {
    for (let _0x206abd in _0x1918f5) {
      const _0x4bb54c = _0x3bf57d.delay
      await _0x116399(_0x4bb54c * 1000)
      if (
        _0x3bf57d.sender &&
        _0x1918f5[_0x206abd].receiver &&
        _0x1918f5[_0x206abd].message
      ) {
        const _0x4d76f7 = await dbQuery(
          "SELECT status FROM blasts WHERE receiver = '" +
            _0x1918f5[_0x206abd].receiver +
            "' AND campaign_id = '" +
            _0xe0ca6d +
            "'"
        )
        if (_0x4d76f7.length > 0) {
          if (_0x4d76f7[0].status === 'pending') {
            const _0x16a2d7 = wa.sendMessage(
              _0x3bf57d.sender,
              _0x1918f5[_0x206abd].receiver,
              _0x1918f5[_0x206abd].message
            )
            _0x16a2d7.then(async (_0xa2546f) => {
              _0xa2546f
                ? await dbQuery(
                    "UPDATE blasts SET status = 'success' WHERE receiver = '" +
                      _0x1918f5[_0x206abd].receiver +
                      "' AND campaign_id = '" +
                      _0xe0ca6d +
                      "'"
                  )
                : await dbQuery(
                    "UPDATE blasts SET status = 'failed' WHERE receiver = '" +
                      _0x1918f5[_0x206abd].receiver +
                      "' AND campaign_id = '" +
                      _0xe0ca6d +
                      "'"
                  )
            })
          } else {
            console.log('no pending, not send!')
          }
        }
      } else {
        console.log('wrong data, progress canceled!')
      }
    }
    return true
  }
  _0x2767e7().then(() => {
    delete inProgress[_0xe0ca6d]
  })
  _0x3b2c01.send({ status: 'in_progress' })
}
module.exports = { sendBlastMessage: sendBlastMessage }
