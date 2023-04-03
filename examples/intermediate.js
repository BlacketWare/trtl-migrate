const migrate = require('trtl-migrate');
const client = new migrate('username', 'password');

client.on('connected', (data) => {
  console.log(`Connected to ${data.user.username}!`)
})

client.on('receivedMessage', (data) => {
  if (data.message === '?hi') client.send(`Hi, ${data.author.name}!`);
})

client.on('error', (err) => {
  console.error(`Uh, oh! Error: ${err.data}`);
})