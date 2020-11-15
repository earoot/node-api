const dynamoose = require("dynamoose");
var Schema = dynamoose.Schema;

const schema = new Schema({
    email: {
      type: String,
      required: true,
      hashKey: true
    },
    password: {
      type: String,
      required: true
    },
    auth_token: {
      type: String,
      required: false
    },
    expiration_token: {
      type: Date,
      required: false
    }
}, {
    saveUnknown: false,
    timestamps: true
});

const User = dynamoose.model("user", schema);

module.exports = User;
