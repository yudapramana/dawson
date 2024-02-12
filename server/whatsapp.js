'use strict'
const _ = require('lodash'),
  { Boom } = require('@hapi/boom'),
  { default: makeWASocket } = require('@whiskeysockets/baileys'),
  {
    fetchLatestBaileysVersion,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
  } = require('@whiskeysockets/baileys'),
  { DisconnectReason } = require('@whiskeysockets/baileys'),
  QRCode = require('qrcode'),
  fs = require('fs')
let sock = [],
  qrcode = [],
  intervalStore = []
const { setStatus } = require('./database/index'),
  { IncomingMessage } = require('./controllers/incomingMessage'),
  { formatReceipt } = require('./lib/helper'),
  axios = require('axios'),
  MAIN_LOGGER = require('./lib/pino'),
  logger = MAIN_LOGGER.child({}),
  connectToWhatsApp = async (_0x35a24c, _0x4909b2 = null) => {
    if (typeof qrcode[_0x35a24c] !== 'undefined') {
      return (
        _0x4909b2 !== null &&
          _0x4909b2.emit('qrcode', {
            token: _0x35a24c,
            data: qrcode[_0x35a24c],
            message: 'please scan with your Whatsapp Account',
          }),
        {
          status: false,
          sock: sock[_0x35a24c],
          qrcode: qrcode[_0x35a24c],
          message: 'Please scann qrcode',
        }
      )
    }
    try {
      let _0x693274 = sock[_0x35a24c].user.id.split(':')
      _0x693274 = _0x693274[0] + '@s.whatsapp.net'
      const _0x358c0e = await getPpUrl(_0x35a24c, _0x693274)
      return (
        _0x4909b2 !== null &&
          (_0x4909b2.emit('connection-open', {
            token: _0x35a24c,
            user: sock[_0x35a24c].user,
            ppUrl: _0x358c0e,
          }),
          console.log(sock[_0x35a24c].user)),
        {
          status: true,
          message: 'Already connected',
        }
      )
    } catch (_0x1429f0) {
      _0x4909b2 !== null &&
        _0x4909b2.emit('message', {
          token: _0x35a24c,
          message: 'Connecting.. (1)',
        })
    }
    const { version: _0x8d12a9, isLatest: _0x5f5b84 } =
      await fetchLatestBaileysVersion()
    console.log(
      'You re using whatsapp gateway M Pedia v5.0.0 - Contact admin if any trouble : 082298859671'
    )
    console.log('using WA v' + _0x8d12a9.join('.') + ', isLatest: ' + _0x5f5b84)
    const { state: _0x510a2c, saveCreds: _0x2e07b7 } =
      await useMultiFileAuthState('./credentials/' + _0x35a24c)
    return (
      (sock[_0x35a24c] = makeWASocket({
        version: _0x8d12a9,
        browser: ['M Pedia', 'Chrome', '103.0.5060.114'],
        logger: logger,
        printQRInTerminal: true,
        auth: {
          creds: _0x510a2c.creds,
          keys: makeCacheableSignalKeyStore(_0x510a2c.keys, logger),
        },
        generateHighQualityLinkPreview: true,
      })),
      sock[_0x35a24c].ev.process(async (_0x4aa033) => {
        if (_0x4aa033['connection.update']) {
          const _0x2658e2 = _0x4aa033['connection.update'],
            {
              connection: _0x301cf7,
              lastDisconnect: _0x117c76,
              qr: _0x35d4d1,
            } = _0x2658e2
          if (_0x301cf7 === 'close') {
            console.log('close')
            if (
              (_0x117c76?.error instanceof Boom)?.output?.statusCode !==
              DisconnectReason.loggedOut
            ) {
              delete qrcode[_0x35a24c]
              if (_0x4909b2 != null) {
                _0x4909b2.emit('message', {
                  token: _0x35a24c,
                  message: 'Connecting..',
                })
              }
              if (
                _0x117c76.error?.output?.payload?.message ===
                'QR refs attempts ended'
              ) {
                delete qrcode[_0x35a24c]
                sock[_0x35a24c].ws.close()
                if (_0x4909b2 != null) {
                  _0x4909b2.emit('message', {
                    token: _0x35a24c,
                    message:
                      'Request QR ended. reload scan to request QR again',
                  })
                }
                return
              }
              _0x117c76?.error.output.payload.message !=
                'Stream Errored (conflict)' &&
                connectToWhatsApp(_0x35a24c, _0x4909b2)
            } else {
              setStatus(_0x35a24c, 'Disconnect')
              console.log('Connection closed. You are logged out.')
              _0x4909b2 !== null &&
                _0x4909b2.emit('message', {
                  token: _0x35a24c,
                  message: 'Connection closed. You are logged out.',
                })
              clearConnection(_0x35a24c)
            }
          }
          _0x35d4d1 &&
            QRCode.toDataURL(_0x35d4d1, function (_0x3992ee, _0x3ce2d5) {
              _0x3992ee && console.log(_0x3992ee)
              qrcode[_0x35a24c] = _0x3ce2d5
              _0x4909b2 !== null &&
                _0x4909b2.emit('qrcode', {
                  token: _0x35a24c,
                  data: _0x3ce2d5,
                  message: 'Please scan with your Whatsapp Account',
                })
            })
          if (_0x301cf7 === 'open') {
            setStatus(_0x35a24c, 'Connected')
            let _0x4e27b6 = sock[_0x35a24c].user.id.split(':')
            _0x4e27b6 = _0x4e27b6[0] + '@s.whatsapp.net'
            const _0x27278d = await getPpUrl(_0x35a24c, _0x4e27b6)
            _0x4909b2 !== null &&
              _0x4909b2.emit('connection-open', {
                token: _0x35a24c,
                user: sock[_0x35a24c].user,
                ppUrl: _0x27278d,
              })
            delete qrcode[_0x35a24c]
          }
        }
        if (_0x4aa033['messages.upsert']) {
          const _0x798c46 = _0x4aa033['messages.upsert']
          IncomingMessage(_0x798c46, sock[_0x35a24c])
        }
        if (_0x4aa033['creds.update']) {
          const _0x32883d = _0x4aa033['creds.update']
          _0x2e07b7(_0x32883d)
        }
      }),
      {
        sock: sock[_0x35a24c],
        qrcode: qrcode[_0x35a24c],
      }
    )
  }
async function connectWaBeforeSend(_0x270afa) {
  let _0x13a58c = undefined,
    _0x219149
  _0x219149 = await connectToWhatsApp(_0x270afa)
  await _0x219149.sock.ev.on('connection.update', (_0x13c2dd) => {
    const { connection: _0x4aa8b8, qr: _0x5896a7 } = _0x13c2dd
    _0x4aa8b8 === 'open' && (_0x13a58c = true)
    _0x5896a7 && (_0x13a58c = false)
  })
  let _0x4e3bed = 0
  while (typeof _0x13a58c === 'undefined') {
    _0x4e3bed++
    if (_0x4e3bed > 4) {
      break
    }
    await new Promise((_0x4a5ec6) => setTimeout(_0x4a5ec6, 1000))
  }
  return _0x13a58c
}
const sendText = async (_0x42e512, _0x1da1d7, _0x1db154) => {
    try {
      const _0xe22e3e = await sock[_0x42e512].sendMessage(
        formatReceipt(_0x1da1d7),
        { text: _0x1db154 }
      )
      return console.log(_0xe22e3e), _0xe22e3e
    } catch (_0x5d9851) {
      return console.log(_0x5d9851), false
    }
  },
  sendMessage = async (_0x3d99a9, _0x5584b8, _0x5beeaa) => {
    try {
      const _0x49895d = await sock[_0x3d99a9].sendMessage(
        formatReceipt(_0x5584b8),
        JSON.parse(_0x5beeaa)
      )
      return _0x49895d
    } catch (_0x17301b) {
      return console.log(_0x17301b), false
    }
  }
async function sendMedia(
  _0x123788,
  _0x24f183,
  _0x3e692d,
  _0x2cd328,
  _0x233a1e,
  _0x24bb99,
  _0x53e10c
) {
  const _0x56da0d = formatReceipt(_0x24f183)
  try {
    if (_0x3e692d == 'image') {
      var _0x1effd7 = await sock[_0x123788].sendMessage(_0x56da0d, {
        image: _0x2cd328
          ? { url: _0x2cd328 }
          : fs.readFileSync('src/public/temp/' + fileName),
        caption: _0x233a1e ? _0x233a1e : null,
      })
    } else {
      if (_0x3e692d == 'video') {
        var _0x1effd7 = await sock[_0x123788].sendMessage(_0x56da0d, {
          video: _0x2cd328
            ? { url: _0x2cd328 }
            : fs.readFileSync('src/public/temp/' + _0x53e10c),
          caption: _0x233a1e ? _0x233a1e : null,
        })
      } else {
        if (_0x3e692d == 'audio') {
          var _0x1effd7 = await sock[_0x123788].sendMessage(_0x56da0d, {
            audio: _0x2cd328
              ? { url: _0x2cd328 }
              : fs.readFileSync('src/public/temp/' + _0x53e10c),
            ptt: _0x24bb99 == 0 ? false : true,
            mimetype: 'audio/mpeg',
          })
        } else {
          if (_0x3e692d == 'pdf') {
            var _0x1effd7 = await sock[_0x123788].sendMessage(
              _0x56da0d,
              {
                document: { url: _0x2cd328 },
                mimetype: 'application/pdf',
                fileName: _0x53e10c + '.pdf',
              },
              { url: _0x2cd328 }
            )
          } else {
            if (_0x3e692d == 'xls') {
              var _0x1effd7 = await sock[_0x123788].sendMessage(
                _0x56da0d,
                {
                  document: { url: _0x2cd328 },
                  mimetype: 'application/excel',
                  fileName: _0x53e10c + '.xls',
                },
                { url: _0x2cd328 }
              )
            } else {
              if (_0x3e692d == 'xlsx') {
                var _0x1effd7 = await sock[_0x123788].sendMessage(
                  _0x56da0d,
                  {
                    document: { url: _0x2cd328 },
                    mimetype:
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    fileName: _0x53e10c + '.xlsx',
                  },
                  { url: _0x2cd328 }
                )
              } else {
                if (_0x3e692d == 'doc') {
                  var _0x1effd7 = await sock[_0x123788].sendMessage(
                    _0x56da0d,
                    {
                      document: { url: _0x2cd328 },
                      mimetype: 'application/msword',
                      fileName: _0x53e10c + '.doc',
                    },
                    { url: _0x2cd328 }
                  )
                } else {
                  if (_0x3e692d == 'docx') {
                    var _0x1effd7 = await sock[_0x123788].sendMessage(
                      _0x56da0d,
                      {
                        document: { url: _0x2cd328 },
                        mimetype:
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        fileName: _0x53e10c + '.docx',
                      },
                      { url: _0x2cd328 }
                    )
                  } else {
                    if (_0x3e692d == 'zip') {
                      var _0x1effd7 = await sock[_0x123788].sendMessage(
                        _0x56da0d,
                        {
                          document: { url: _0x2cd328 },
                          mimetype: 'application/zip',
                          fileName: _0x53e10c + '.zip',
                        },
                        { url: _0x2cd328 }
                      )
                    } else {
                      if (_0x3e692d == 'mp3') {
                        var _0x1effd7 = await sock[_0x123788].sendMessage(
                          _0x56da0d,
                          {
                            document: { url: _0x2cd328 },
                            mimetype: 'application/mp3',
                          },
                          { url: _0x2cd328 }
                        )
                      } else {
                        return (
                          console.log('Please add your won role of mimetype'),
                          {
                            error: true,
                            message: 'Please add your won role of mimetype',
                          }
                        )
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return _0x1effd7
  } catch (_0x579151) {
    return false
  }
}
async function sendButtonMessage(
  _0x374387,
  _0x2a5ae2,
  _0x4ef396,
  _0x5179b2,
  _0x51d3e8,
  _0x4ed0ef
) {
  let _0x10ade2 = 'url'
  try {
    const _0x13a5a8 = _0x4ef396.map((_0x5d501f, _0x190b4d) => {
      return {
        buttonId: _0x190b4d,
        buttonText: { displayText: _0x5d501f.displayText },
        type: 1,
      }
    })
    if (_0x4ed0ef) {
      var _0x2a5869 = {
        image:
          _0x10ade2 == 'url'
            ? { url: _0x4ed0ef }
            : fs.readFileSync('src/public/temp/' + _0x4ed0ef),
        caption: _0x5179b2,
        footer: _0x51d3e8,
        buttons: _0x13a5a8,
        headerType: 4,
        viewOnce: true,
      }
    } else {
      var _0x2a5869 = {
        text: _0x5179b2,
        footer: _0x51d3e8,
        buttons: _0x13a5a8,
        headerType: 1,
        viewOnce: true,
      }
    }
    const _0x927440 = await sock[_0x374387].sendMessage(
      formatReceipt(_0x2a5ae2),
      _0x2a5869
    )
    return _0x927440
  } catch (_0x210e46) {
    return console.log(_0x210e46), false
  }
}
async function sendTemplateMessage(
  _0x1342ba,
  _0x2094e0,
  _0x497d54,
  _0x178109,
  _0x3c90ab,
  _0x4d88f2
) {
  try {
    if (_0x4d88f2) {
      var _0xe80e05 = {
        caption: _0x178109,
        footer: _0x3c90ab,
        viewOnce: true,
        templateButtons: _0x497d54,
        image: { url: _0x4d88f2 },
        viewOnce: true,
      }
    } else {
      var _0xe80e05 = {
        text: _0x178109,
        footer: _0x3c90ab,
        viewOnce: true,
        templateButtons: _0x497d54,
      }
    }
    const _0x2b69af = await sock[_0x1342ba].sendMessage(
      formatReceipt(_0x2094e0),
      _0xe80e05
    )
    return _0x2b69af
  } catch (_0x2e9d45) {
    return console.log(_0x2e9d45), false
  }
}
async function sendListMessage(
  _0x16a83e,
  _0x9d367f,
  _0x301e22,
  _0x7d4969,
  _0x27ecb9,
  _0x5f3cc7,
  _0x4fa5ed
) {
  try {
    const _0x30a85f = {
        text: _0x7d4969,
        footer: _0x27ecb9,
        title: _0x5f3cc7,
        buttonText: _0x4fa5ed,
        sections: [_0x301e22],
        viewOnce: true,
      },
      _0x2563fb = await sock[_0x16a83e].sendMessage(
        formatReceipt(_0x9d367f),
        _0x30a85f,
        { ephemeralExpiration: 604800 }
      )
    return _0x2563fb
  } catch (_0xe90cdf) {
    return console.log(_0xe90cdf), false
  }
}
async function sendPollMessage(
  _0x439bf9,
  _0x50bb1a,
  _0x39310c,
  _0x5d3163,
  _0x435761
) {
  try {
    const _0x5df4a5 = await sock[_0x439bf9].sendMessage(
      formatReceipt(_0x50bb1a),
      {
        poll: {
          name: _0x39310c,
          values: _0x5d3163,
          selectableCount: _0x435761,
        },
      }
    )
    return _0x5df4a5
  } catch (_0x164014) {
    return console.log(_0x164014), false
  }
}
async function fetchGroups(_0x43c51f) {
  try {
    let _0x4bcf7e = await sock[_0x43c51f].groupFetchAllParticipating(),
      _0x3eff32 = Object.entries(_0x4bcf7e)
        .slice(0)
        .map((_0x57db4d) => _0x57db4d[1])
    return _0x3eff32
  } catch (_0x4ddb93) {
    return false
  }
}
async function isExist(_0x499f83, _0x38a281) {
  if (typeof sock[_0x499f83] === 'undefined') {
    const _0x177fb4 = await connectWaBeforeSend(_0x499f83)
    if (!_0x177fb4) {
      return false
    }
  }
  try {
    if (_0x38a281.includes('@g.us')) {
      return true
    } else {
      const [_0x38b693] = await sock[_0x499f83].onWhatsApp(_0x38a281)
      return _0x38b693
    }
  } catch (_0x18fffc) {
    return false
  }
}
async function getPpUrl(_0x680376, _0x5def92, _0x366f3a) {
  let _0x55504e
  try {
    return (
      (_0x55504e = await sock[_0x680376].profilePictureUrl(_0x5def92)),
      _0x55504e
    )
  } catch (_0x29e924) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png'
  }
}
async function deleteCredentials(_0x2546b3, _0xd00fe0 = null) {
  _0xd00fe0 !== null &&
    _0xd00fe0.emit('message', {
      token: _0x2546b3,
      message: 'Logout Progres..',
    })
  try {
    if (typeof sock[_0x2546b3] === 'undefined') {
      const _0x92e56f = await connectWaBeforeSend(_0x2546b3)
      _0x92e56f && (sock[_0x2546b3].logout(), delete sock[_0x2546b3])
    } else {
      sock[_0x2546b3].logout()
      delete sock[_0x2546b3]
    }
    return (
      delete qrcode[_0x2546b3],
      clearInterval(intervalStore[_0x2546b3]),
      setStatus(_0x2546b3, 'Disconnect'),
      _0xd00fe0 != null &&
        (_0xd00fe0.emit('Unauthorized', _0x2546b3),
        _0xd00fe0.emit('message', {
          token: _0x2546b3,
          message: 'Connection closed. You are logged out.',
        })),
      fs.existsSync('./credentials/' + _0x2546b3) &&
        fs.rmSync(
          './credentials/' + _0x2546b3,
          {
            recursive: true,
            force: true,
          },
          (_0x397ae9) => {
            if (_0x397ae9) {
              console.log(_0x397ae9)
            }
          }
        ),
      {
        status: true,
        message: 'Deleting session and credential',
      }
    )
  } catch (_0x3e9c14) {
    return (
      console.log(_0x3e9c14),
      {
        status: true,
        message: 'Nothing deleted',
      }
    )
  }
}
async function getChromeLates() {
  const _0x25e2b9 = await axios.get(
    'https://versionhistory.googleapis.com/v1/chrome/platforms/linux/channels/stable/versions'
  )
  return _0x25e2b9
}
function clearConnection(_0xccc404) {
  clearInterval(intervalStore[_0xccc404])
  delete sock[_0xccc404]
  delete qrcode[_0xccc404]
  setStatus(_0xccc404, 'Disconnect')
  fs.existsSync('./credentials/' + _0xccc404) &&
    (fs.rmSync(
      './credentials/' + _0xccc404,
      {
        recursive: true,
        force: true,
      },
      (_0x11ec2d) => {
        if (_0x11ec2d) {
          console.log(_0x11ec2d)
        }
      }
    ),
    console.log('credentials/' + _0xccc404 + ' is deleted'))
}
async function initialize(_0x2cc5da, _0x5ca167) {
  const { token: _0x38bd6a } = _0x2cc5da.body
  if (_0x38bd6a) {
    const _0x5bdf25 = require('fs'),
      _0x371d79 = './credentials/' + _0x38bd6a
    if (_0x5bdf25.existsSync(_0x371d79)) {
      sock[_0x38bd6a] = undefined
      const _0x5df5f0 = await connectWaBeforeSend(_0x38bd6a)
      return _0x5df5f0
        ? _0x5ca167.status(200).json({
            status: true,
            message: 'Connection restored',
          })
        : _0x5ca167.status(200).json({
            status: false,
            message: 'Connection failed',
          })
    }
    return _0x5ca167.send({
      status: false,
      message: _0x38bd6a + ' Connection failed,please scan first',
    })
  }
  return _0x5ca167.send({
    status: false,
    message: 'Wrong Parameterss',
  })
}
module.exports = {
  connectToWhatsApp: connectToWhatsApp,
  sendText: sendText,
  sendMedia: sendMedia,
  sendButtonMessage: sendButtonMessage,
  sendTemplateMessage: sendTemplateMessage,
  sendListMessage: sendListMessage,
  sendPollMessage: sendPollMessage,
  isExist: isExist,
  getPpUrl: getPpUrl,
  fetchGroups: fetchGroups,
  deleteCredentials: deleteCredentials,
  sendMessage: sendMessage,
  initialize: initialize,
  connectWaBeforeSend: connectWaBeforeSend,
}
