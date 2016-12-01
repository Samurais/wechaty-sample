'use strict';
/**
 * Philly Wechat Server
 * https://github.com/Samurais/philly-wechat
 */

const QrcodeTerminal = require('qrcode-terminal');
const { Wechaty, Config, log, Message } = require('wechaty');
const bot = Wechaty.instance({
    profile: Config.DEFAULT_PROFILE
})

bot
    .on('scan', (url, code) => {
        if (!/201|200/.test(String(code))) {
            let loginUrl = url.replace(/\/qrcode\//, '/l/');
            QrcodeTerminal.generate(loginUrl);
        }
        console.log(`${url}\n[${code}] Scan QR Code in above url to login: `);
    })
    .on('login', user => console.log('Bot', `bot login: ${user}`))
    .on('logout', e => console.log('Bot', 'bot logout.'))
    .on('message', m => {
        if (m.self()) {
            return;
        }
        const room = m.room();
        if (room && /Wechaty/i.test(room.topic())) {
            console.log(room.topic());
        }
        else {
            console.log('Bot', 'recv: %s', m);
        }
    });

bot.init()
    .catch(e => {
        console.log('Bot', 'init() fail:' + e);
        bot.quit();
        process.exit(-1);
    });