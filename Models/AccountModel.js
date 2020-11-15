const dynamoose = require("dynamoose");
var Schema = dynamoose.Schema;

const schema = new Schema({
    id: {
      type: String,
      required: true,
      hashKey: true
    },
    email: {
      type: String,
      required: true
    },
    storeId: {
      type: String,
      required: true
    },
    transactions: {
      type: Array,
      required: true
    }
}, {
    saveUnknown: true,
    timestamps: true
});

const Account = dynamoose.model("account", schema);

module.exports = Account;
