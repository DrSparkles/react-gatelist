const id = require('pow-mongodb-fixtures').createObjectId;

module.exports = [
  {
    "_id":id("5ab0d2f5528adc08f0412184"),
    "userId":id("5ab0d2d4528adc08f0412183"),
    "listname":"Great List",
    "tasks":[
      {
        "taskname":"Great Task",
        "notes":"I'm a great note",
        "duedate":"2018-01-01",
        "completed":false,
        "_id":id("5ab0d316528adc08f0412185")
      },
      {
        "taskname":"Tasks for show hide 1",
        "notes":"",
        "duedate":"",
        "completed":false,
        "_id":id("5ab1c18985e4d30bbc584cc5")
      }
    ]
  }
];