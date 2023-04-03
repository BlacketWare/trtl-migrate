// trtl-migrate
// extension to trtljs
// built by death
// based off betastar.js: https://unpkg.com/betastar.js@1.1.2/src/blacketjs.js

const ws = require('ws');
const axios = require('axios');
const EventEmitter = require('events');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class trtlmigrate extends EventEmitter {
  #ratelimited = false;
  #delay = 1000;
  socket;
  info;
  token;

  constructor(username, password) {
    super();

    this.info = {
      username: username,
      password: password,
    };

    axios.get('https://blacket.org/worker/verify', (t) => {
      if (t.data.error && t.data.reason !== 'You are already verified.') throw new Error(t.data);

      axios.post("https://blacket.org/worker/login", {
        username: username,
        password: password
      }).then((res) => {
        if (res.data.error) throw new Error(res.data.reason);

        this.token = res.headers["set-cookie"][0].split(";")[0];
        this.socket = new ws.WebSocket(`wss://blacket.org/worker/socket`, {
          headers: {
            cookie: this.token
          }
        });

        this.socket.onopen = async () => {
          this.listners = {
            on: (event, callback) => {
              this.socket.onmessage = async (msg) => {
                if (JSON.parse(msg.data).type === event) callback(JSON.parse(msg.data));
              };
            },
            emit: (event, data) => {
              this.socket.send(JSON.stringify({
                type: event,
                data
              }));
            }
          };

          this.socket.send(JSON.stringify({
            type: 'join',
            data: 'global'
          }));

          await sleep(100);

          this.socket.send(JSON.stringify({
            type: 'leave',
            data: 'global'
          }));

          await sleep(100);

          this.socket.send(JSON.stringify({
            type: 'join',
            data: 'bot'
          }));

          await sleep(100)

          this.emit('connected', {
            user: {
              username: this.info.username,
              password: this.info.password
            },
            PHPSESSID: this.token,
            token: this.token
          });

          this.listeners.on('chat', (json) => {
            if (json.error) return this.emit('error', data.reason);

            axios.get("https://blacket.org/worker/user/" + json.user.id, {
              headers: {
                Cookie: this.token
              },
            }).then((data) => {
              if (data.error) return;
              let aData = data.data.user;
              let emittedData = {
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
                  element: json.user.avatar.split('/')[3].split('.')[0],
                  avatar: json.user.avatar.split('/')[3].split('.')[0],
                  elementUrl: json.user.avatar,
                  avatarURL: json.user.avatar,
                  color: json.user.color,
                  atoms: aData.tokens,
                  tokens: aData.tokens
                },
                reply: (msg) => {
                  this.sendMessage(`@${json.user.username}, ${msg}`);
                },
                mentions: json.message.split(" ").filter((x) => x.startsWith("@")).map((x) => x.slice(1))
              };

              if (json.message.toLowerCase().includes(`@${this.info.username.toLowerCase()} `) || json.message.toLowerCase().endsWith(`@${this.info.username.toLowerCase()}`)) {
                emittedData.mentioned = true;
                this.emit("onMention", emittedData);
              };

              this.emit("receivedMessage", emittedData);
            });
          });
        };
      });
    });
  };

  async sendMessage(msg) {
    if (this.#ratelimited) this.emit('ratelimited');
    this.#lastMessage = msg;

    this.listeners.emit('chat', msg);
    this.emit("sentMessage", {
      message: msg
    });

    this.#ratelimited = true;
    setTimeout(() => this.#ratelimited = false, this.#delay);
  };

  async send(msg) {
    if (this.#ratelimited) this.emit('ratelimited');
    this.#lastMessage = msg;

    this.listeners.emit('chat', msg);
    this.emit("sentMessage", {
      message: msg
    });

    this.#ratelimited = true;
    setTimeout(() => this.#ratelimited = false, this.#delay);
  };
};

module.exports = trtlmigrate;