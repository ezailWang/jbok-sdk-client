const jbok = require("../lib");
const block = require("./block");
const account = require("./account");
const transaction = require("./transaction");
const contract = require("./contract");
const utils = require("./utils");

/**
 * @module jbokSdk/api
 */

/**
 * @param {string} uri -(option) Your Node uri default http://localhost:30315
 */

module.exports = function(uri) {
  if (!uri) {
    uri = "http://localhost:30315";
  }
  const client = jbok.SdkClient.http(uri);

  return {
    block: block(client),
    transaction: transaction(client),
    account: account(client),
    contract: contract(client),
    utils:utils(),
  };
};
