const dynamoose = require("dynamoose");
var Schema = dynamoose.Schema;

const schema = new Schema({
    id: {
      type: String,
      required: true,
      hashKey: true
    },
    name: {
      type: String,
      required: true
    }
}, {
    saveUnknown: false,
    timestamps: true
});

const Store = dynamoose.model("store", schema);

module.exports = Store;
