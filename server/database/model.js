const { dbQuery } = require('./index'),
  cache = require('./../lib/cache'),
  myCache = cache.myCache,
  isExistsEqualCommand = async (_0x290cb5, _0x528120) => {
    if (myCache.has(_0x290cb5 + _0x528120)) {
      return myCache.get(_0x290cb5 + _0x528120)
    }
    let _0x5a2a4e = await dbQuery(
      "SELECT * FROM devices WHERE body = '" + _0x528120 + "' LIMIT 1"
    )
    if (_0x5a2a4e.length === 0) {
      return []
    }
    let _0x3f3ba1 = _0x5a2a4e[0].id,
      _0x3fd265 = await dbQuery(
        'SELECT * FROM autoreplies WHERE keyword = "' +
          _0x290cb5 +
          "\" AND type_keyword = 'Equal' AND device_id = " +
          _0x3f3ba1 +
          " AND status = 'Active' LIMIT 1"
      )
    if (_0x3fd265.length === 0) {
      return []
    }
    return myCache.set(_0x290cb5 + _0x528120, _0x3fd265), _0x3fd265
  },
  isExistsContainCommand = async (_0x353e43, _0x31c23d) => {
    if (myCache.has('contain' + _0x353e43 + _0x31c23d)) {
      return myCache.get('contain' + _0x353e43 + _0x31c23d)
    }
    let _0x3f65df = await dbQuery(
      "SELECT * FROM devices WHERE body = '" + _0x31c23d + "' LIMIT 1"
    )
    if (_0x3f65df.length === 0) {
      return []
    }
    let _0x1e4c29 = _0x3f65df[0].id,
      _0x4dc93d = await dbQuery(
        'SELECT * FROM autoreplies WHERE LOCATE(keyword, "' +
          _0x353e43 +
          "\") > 0 AND type_keyword = 'Contain' AND device_id = " +
          _0x1e4c29 +
          " AND status = 'Active' LIMIT 1"
      )
    if (_0x4dc93d.length === 0) {
      return []
    }
    return myCache.set('contain' + _0x353e43 + _0x31c23d, _0x4dc93d), _0x4dc93d
  },
  getUrlWebhook = async (_0x3dc712) => {
    if (myCache.has('webhook' + _0x3dc712)) {
      return myCache.get('webhook' + _0x3dc712)
    }
    let _0x1f92d9 = null,
      _0x209d1c = await dbQuery(
        "SELECT webhook FROM devices WHERE body = '" + _0x3dc712 + "' LIMIT 1"
      )
    return (
      _0x209d1c.length > 0 && (_0x1f92d9 = _0x209d1c[0].webhook),
      myCache.set('webhook' + _0x3dc712, _0x1f92d9),
      _0x1f92d9
    )
  }
module.exports = {
  isExistsEqualCommand: isExistsEqualCommand,
  isExistsContainCommand: isExistsContainCommand,
  getUrlWebhook: getUrlWebhook,
}
