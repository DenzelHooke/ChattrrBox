

// Holds each user in their respective room.
//? Could create class instances for each user but js objects seem to be good enough.
const users = [
  {
    rooms:[
      {
        'general':[]
      },
      {
        'chill':[]
      },
      {
        'coding':[]
      },
    ]
  }
];

module.exports = {
  users,
}

