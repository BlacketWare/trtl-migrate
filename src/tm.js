// https://unpkg.com/betastar.js@1.1.2/src/blacketjs.js
const trtlp = require('blacket-trtl')
const axios = require('axios')
const EventEmitter = require('events');

class trtlmigrate extends EventEmitter {
    #ratelimited = null; // you can still listen to events with "client.on('error', (data) => {})"
    #delay = null;
    socket;
    info;
    token;
    #socketWorking = true;
    #lastMessage;

    constructor(username, password) {
        super();
        this.info = {
            username: username,
            password: password,
        };
        axios.post("https://blacket.org/worker/login", {
          username: username,
          password: password
        }, {
          headers: {
            "user-agent": "ankha"
          }
        }).then((res) => {
            this.token = res.headers["set-cookie"][0].split(";")[0];
            const trtl = new trtlp.TurtleClient(this.token.split('=')[1])
            this.socket = {
                on: (event, callback) => {
                    trtl.socketOn(event, (data) => callback(data))
                },
                emit: (event, data) => {
                    trtl.emit(event, data)
                }
            }

            trtl.on('connected', async () => {
              trtl.join();
                this.emit('connected', {
                    user: {
                        username: this.info.username,
                        password: this.info.password
                    },
                    PHPSESSID: this.token,
                    token: this.token
                });

                trtl.socketOn('chat', (json) => {
                  if (json.error) return this.emit('error', 'chat', json.reason);
                  axios.get("https://blacket.org/worker/user/" + json.user.id, {
                    headers: {
                        Cookie: this.token,
                        'user-agent': 'ankha'
                    },
                  }).then((data) => {
                    if (data.error) return this.emit('error', 'internal', data.reason)
                    var aData = data.data.user
                    var obj = {
                      raw: json,
                      content: json.message,
                      mentioned: false,
                      time: json.time,
                      author: {
                        raw: aData,
                        id: json.user.id,
                        name: json.user.username,
                        role: json.user.role,
                        badges: json.user.badges,
                        element: json.user.avatar.split('/')[3].split('.'), // betastarjs
                        avatar: json.user.avatar.split('/')[3].split('.'),
                        elementUrl: json.user.avatar,
                        avatarURL: json.user.avatar,
                        color: json.user.color,
                        atoms: aData.tokens, // betastarjs
                        tokens: aData.tokens,
                        linked: null // depricated
                      },
                      reply: (msg) => {
                        this.sendMessage(`@${json.user.username}, ${msg}`);
                      },
                      mentions: json.message.split(" ").filter((x) => x.startsWith("@")).map((x) => x.slice(1)),
                      everyoneMentioned: null // depricated
                    };

                    this.emit("receivedMessage", obj);
                    if (json.message.includes(`@${this.info.username} `) || json.message.endsWith(`@${this.info.username}`)) {
                        obj.mentioned = true;
                        this.emit("onMention", obj);
                    }
                  });
                });
            });

            return this;
        });

        async function sendMessage(msg) {
          this.#lastMessage = msg;

          trtl.socketEmit('chat', msg);
          this.emit("sentMessage", {
            message: msg,
          });
        };

        async function send(msg) {
            sendMessage(msg);
        };
    };
};

module.exports = trtlmigrate;