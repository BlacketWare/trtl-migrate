// good devs will say this is far from advanced, but it is just an example.

const migrate = require('trtl-migrate');
const client = new migrate('username', 'password');

client.on('connected', (data) => {
  this.username = data.user.username
  console.log(`Connected to ${data.user.username}!`)
})

client.on('receivedMessage', (data) => {
  if (data.message === '?hi') client.send(`Hi, ${data.author.name}!`);
  else if (data.message === '?me') data.reply(`You're ${data.author.name}, with ${data.author.avatar} as your profile and ${data.author.tokens} tokens.`)
  else if (data.message === '?help') client.send(`My commands are ?me and ?hi.`)
})

client.on('onMention', (data) => {
  client.send(`Hi ${data.author.name}, I'm ${this.username}. My prefix is ? (a question mark).`)
})

client.on('error', (err) => {
  console.error(`Uh, oh! Error: ${err.data}`);
})