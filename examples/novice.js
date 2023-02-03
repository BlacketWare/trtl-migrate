const migrate = require('trtl-migrate');
const client = new migrate('username', 'password');

client.sendMessage("Hello, world.");

client.on('receivedMessage', (data) => {
  console.log(data.author.name + ' said ' + data.content);
});