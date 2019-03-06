"use strict";

var sdk = require("./src");
//const url = "http://47.52.218.141:20002"; //远端节点1
//const url = 'http://47.52.219.20:20002'  //远端节点2
const url = "http://139.224.255.21:20002"; //远端节点3
//const url = 'http://192.168.50.249:20002' //局域网
//const url = "http://localhost:20002"; //本机节点
const client = sdk.Client;
const hasher = sdk.Hasher;
const jsonCodec = sdk.JsonCodec;
const binaryCodec = sdk.BinaryCodec;
const signer = sdk.Signer;
const Contract = sdk.Contract;
const sdkClient = sdk.Client.http(url);

module.exports = {
  //获取当前最高区块数
  /**
   *
   * @param {object} params
   */
  bestBlockNumber: async function(params) {
    const rsp = await sdkClient.jsonrpc("bestBlockNumber", {});
    return rsp;
  },

  //获取区块信息
  /**
   *
   * @param {object} params
   */
  getBlockByNumber: async function(params) {
    const rsp = await sdkClient.jsonrpc(
      "getBlockByNumber",
      JSON.stringify(params)
    );
    return rsp;
  },

  //获取账户信息 （可获得地址的交易nonce）
  /**
   *
   * @param {object} params
   */
  getAccount: async function(params) {
    const rsp = await sdkClient.jsonrpc("getAccount", JSON.stringify(params));
    return rsp;
  },

  //获取余额信息
  /**
   *
   * @param {object} params
   */
  getBalance: async function(params) {
    const rsp = await sdkClient.jsonrpc("getBalance", JSON.stringify(params));
    return rsp;
  },

  //通过hash获取交易详情（可知道是否已经进块）
  /**
   *
   * @param {object} params
   */
  getTransactionReceipt: async function(params) {
    const rsp = await sdkClient.jsonrpc(
      "getTransactionReceipt",
      JSON.stringify(params)
    );
    return rsp;
  },

  //发送交易
  /**
   *
   * @param {object} txJson
   * @param {string} priKey
   * @param {int} chainId
   */
  sendSignedTransaction: async function(txJson, priKey, chainId) {
    const transactionObject = jsonCodec.decodeTransaction(
      JSON.stringify(txJson)
    );
    const signedTx = signer.signTx(transactionObject, priKey, chainId);
    const signedTxJson = jsonCodec.encodeSignedTransaction(signedTx);
    const params = JSON.parse(signedTxJson);
    const rsp = await sdkClient.jsonrpc(
      "sendSignedTransaction",
      JSON.stringify(params)
    );
    return rsp;
  },

  //部署合约
  /**
   *
   * @param {object} txJson
   * @param {string} priKey
   * @param {int} chainId
   */
  deploy: async function(txJson, priKey, chainId) {
    const rsp = await this.sendSignedTransaction(txJson, priKey, chainId);
    return rsp;
  },

  //调用合约方法
  /**
   *
   * @param {String} contractAddress
   * @param {String} method
   * @param {object} params
   * @param {String} priKey
   * @param {String} codeStr
   * @param {String} nonce
   * @param {int} chainId
   */
  contractSend: async function(
    contractAddress,
    method,
    params,
    priKey,
    codeStr,
    nonce,
    chainId
  ) {
    const contractCode = await sdkClient.jsonrpc(
      "parseContractCode",
      JSON.stringify(codeStr)
    );
    const jsonObject = JSON.parse(contractCode);
    if (!jsonObject.body.errors) {
      const contractObject = jsonCodec.decodeContract(
        JSON.stringify(jsonObject.body.contract)
      );
      const payload = contractObject.encode(method, params);
      const contractTx = {
        nonce: nonce,
        gasPrice: "1",
        gasLimit: "1500000",
        receivingAddress: contractAddress,
        value: "0",
        payload: payload
      };
      const rsp = await this.sendSignedTransaction(contractTx, priKey, chainId);
      return rsp;
    } else {
      console.log("parseContractCode error", jsonObject.errors);
      return new Promise.reject(jsonObject.errors);
    }
  },

  //查询合约变量或者调用查询方法
  /**
   *
   * @param {object} params
   */
  contractCall: async function(params) {
    const rsp = await sdkClient.jsonrpc(
      "callContractTransaction",
      JSON.stringify(params)
    );
    return rsp;
  }
};
