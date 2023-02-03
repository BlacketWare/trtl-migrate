const migrate = require('trtl-migrate');
const blacket = require('blacket');
const client = new migrate('username', 'password');

client.on('connected', (data) => {
  console.log(`Connected to ${data.user.username}!`)
})

client.on('receivedMessage', (data) => {
  if (data.message === '?hi') client.send(`Hi, ${data.author.name}!`);
})

client.on('error', (type, data) => {
  blacket.chalk('red', `Uh, oh! Error in ${type}: ${data}`);
})