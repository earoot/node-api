const Account = require('../Models/AccountModel');
const userController = require('./UsersController');
const storeController = require('./StoresController');
const helper = require('../helper');
const { v4: uuidv4 } = require('uuid');

const updateTransactions = (accounts, amount) => {
  return new Promise(function(resolve, reject) {
    let transactions = accounts[0].transactions;
    let obj = {
      dateInMiliseconds: Date.now(),
      amount: amount
    };
    transactions.push(obj);
    let accountObj = {
      ...accounts[0],
      transactions
    };
    Account.update({id:accounts[0].id }, { transactions }, (error, account) => {
      if(error) { reject(error) }
      resolve(accountObj);
    });
  });
};

const createAccountAndTransactions = ({ email, storeId, amount }) => {
  return new Promise(async function(resolve, reject) {
    let array = [];
    let obj = {
      amount: amount,
      date: Date.now()
    };
    array.push(obj);
    account = new Account({ id: uuidv4(), email, storeId, transactions:array });
    await account.save();
    resolve(account);
  });
};

const getTransactionsBalance = (transactions) => {
  return new Promise(function(resolve, reject) {
    let total = 0;
    transactions.forEach((transaction, i) => {
      total = total + parseFloat(transaction.amount);
      if(i===(transactions.length-1)){
        resolve(total);
      }
    });
  });
};

exports.registerTransaction = async (req, res, next) => {
  let account = {};
  const { email, storeId, amount } = req.body;

  const accounts = await Account.scan({
    "email": {"eq": email},
    "storeId": {"eq": storeId}
  }).exec();

  if(accounts.count>0){
    account = await updateTransactions(accounts, amount);
  } else {
    account = await createAccountAndTransactions(req.body);
  }
  account.balance = await getTransactionsBalance(account.transactions);

  return helper.responseJson(res, 200, 'Accounts listed successfully', account);
};

exports.getAccountInfo = async (req, res, next) => {
  let account = {};

  const email = req.params.email;
  const storeId = req.params.store;

  const accounts = await Account.scan({
    "email": {"eq": email},
    "storeId": {"eq": storeId}
  }).exec();

  if (!accounts.count) return helper.responseJson(res, 404, 'This account does not exist', {});

  account = accounts[0];
  account.balance = await getTransactionsBalance(account.transactions);

  return helper.responseJson(res, 200, 'Accounts listed successfully', account);
};
