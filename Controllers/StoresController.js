const Store = require('../Models/StoreModel');
const helper = require('../helper.js');
const { v4: uuidv4 } = require('uuid');

exports.get  = async (req, res, next) => {
  try {
    let stores = await Store.scan().exec();
    return helper.responseJson(res, 200, 'Stores listed successfully', stores, 'stores');
  } catch (e) {
    console.log(e);
    next(e);
  }
};

exports.store =  async (req, res, next) => {
  const obj = {
    id: uuidv4(),
    name: req.body.name
  };
  try {
    const store = new Store(obj);
    await store.save();

    return helper.responseJson(res, 201, 'Store created successfully', store, 'store');

  } catch (error) {
    next(error)
  }
};

exports.remove = async (req, res, next) => {
  const _id = req.params.id;
  const store = await Store.get(_id);
  if (!store) return helper.responseJson(res, 401, 'This store does not exist', {});
  store.delete((error) => {
      if (error) {
          console.error(error);
          next(error);
      }
      return helper.responseJson(res, 200, 'Store deleted successfully', {});
  });
};
