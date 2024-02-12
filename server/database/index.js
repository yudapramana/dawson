const mysql2 = require('mysql2')
require('dotenv').config()
const db = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }),
  setStatus = (_0x58d8df, _0x19cc22) => {
    try {
      return (
        db.query(
          "UPDATE devices SET status = '" +
            _0x19cc22 +
            "' WHERE body = " +
            _0x58d8df +
            ' '
        ),
        true
      )
    } catch (_0x14b39d) {
      return false
    }
  }
function dbQuery(_0x3792ad) {
  return new Promise((_0x512f7f) => {
    db.query(_0x3792ad, (_0x23e69f, _0x1b83eb) => {
      if (_0x23e69f) {
        throw _0x23e69f
      }
      try {
        _0x512f7f(_0x1b83eb)
      } catch (_0x4a2ec3) {
        _0x512f7f({})
      }
    })
  })
}
module.exports = {
  setStatus: setStatus,
  dbQuery: dbQuery,
  db: db,
}
