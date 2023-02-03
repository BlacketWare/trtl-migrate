# trtl-migrate docs

You can find examples of this library [here](https://github.com/VillainsRule4000/trtl-migrate/blob/main/examples).

### Constructor
```js
const migrate = require('trtl-migrate');
const client = new migrate('bot username', 'bot password');
// if you're on replit, use an env variable for the password --> https://docs.replit.com/programming-ide/storing-sensitive-information-environment-variables
```

## Functions
### sendMessage

#### Parameters:
| name | description |
|-|-|
|message|The message to send (string) |

Example:
```js
const migrate = require('trtl-migrate');
const client = new migrate('bot username', 'bot password');

client.sendMessage("Hello, world.");
client.send("Hello, world.");
```

## Events
### connected

- Emitted when the client is connected!
    - returns a [clientInfo Object](https://github.com/VillainsRule4000/trtl-migrate/blob/main/docs/README.md#message)

### sentMessage

- Emitted when a message is sent
    - Returns the message sent.

### receivedMessage

- Emitted when a message is recieved via `chat`
    - Returns a [message Object](https://github.com/VillainsRule4000/trtl-migrate/blob/main/docs/README.md#message)


### onMention

- Emitted when a message recieved via `chat` includes a mention to the bot
    - Returns a [message Object](https://github.com/VillainsRule4000/trtl-migrate/blob/main/docs/README.md#clientInfo)

### error
- Emitted when an error occurs.
    - Returns a [error Object](https://github.com/VillainsRule4000/trtl-migrate/blob/main/docs/README.md#error)

 ## Objects / Classes
 
 ### user
 #### Attributes
  - raw - Object, the request data from an API fetch of the user.
  - id - Integer, the ID of the user.
  - name - String, the name of the user.
  - role - String, the user's role.
  - badges - Array, an array of the user's badges.
  - avatar - String, the name of the user's profile blook/avatar.
  - element - same as avatar.
  - avatarURL - String, a link to the user's profile blook/avatar.
  - elementUrl - same as avatarURL.
  - color - String, the users color to their role / username (hex).
  - tokens - Integer, amount of tokens the user has.
  - atoms - same as tokens.
    
 #### Methods
  - None.
<br>
 
 ### message
 #### Attributes
  - raw - Object, the raw data from the socket message.
  - content - String, content of the message.
  - mentioned - Boolean, if the bot was mentioned.
  - time - Integer, the time the message was sent.
  - author - Object, the [user](https://github.com/VillainsRule4000/trtl-migrate/blob/main/docs/README.md#user) who sent the message.
  - mentions - Array, the array of users mentioned.

 #### Methods
  - reply(msg) - Sends a reply to the message.
<br>

### clientInfo
 #### Attributes
  - user - Object, includes the logged in accounts username (e.g. { username: 'username', password: 'password' })
  - PHPSESSID - String, the phpsessid of the logged in account, (it is reccomened to keep using client.token for API requests)
  - token - String, the same as the PHPSESSID

 #### Methods
  - None.
<br>

### error
 #### Attributes
  - type - String, at this time may be named either `internal` or `chat`.
  - error - String, the exact error.

 #### Methods
  - None.