"use strict";
var sdkClient = require("./jbokClient");
var codeParams = require("./params");
var example = async function() {
  //bestBlockNumber
  const params = {
    method: "bestBlockNumber", //调用api的methodName
    params: {} //api需要的参数列表
  };

  const rsp = await sdkClient.bestBlockNumber(params);
  console.log("\n\nbestBlockNumber:", rsp);

  //getBlockByNumber
  const params1 = "10";
  const rsp1 = await sdkClient.getBlockByNumber(params1);
  console.log("\n\ngetBlockByNumber:", rsp1);

  //getBalance
  const blockParam = {
    //WithNumber:{n:'830'}    //查询某个区块高度时的余额
    Latest: {} //查询最新余额状态
  };
  const params3 = ["0xa9f26854c08e6a707c9378839c24b5c085f8ce11", blockParam];
  const rsp3 = await sdkClient.getBalance(params3);
  console.log("\n\ngetBalance:", rsp3);

  //getAccount  查询账号下当前的nonce
  const params4 = ["0xa9f26854c08e6a707c9378839c24b5c085f8ce11", blockParam];
  const rsp4 = await sdkClient.getAccount(params4);
  console.log("\n\ngetAccount:", rsp4);

  //getTransactionReceipt
  const params5 =
    "d65cdebef178408c4b9c449bf73102460293f19deff94f6a191a446926e76157";

  const rsp5 = await sdkClient.getTransactionReceipt(params5);
  console.log("\ngetTransactionReceipt:", rsp5);

  // 发起交易  sendSignedTransaction
  const txRow = {
    nonce: "12", //nonce 要通过getAccount获取 账户内显示nonce即为下次交易的nonce值
    gasPrice: "1",
    gasLimit: "21000",
    receivingAddress:
      "0c96bed0ebbed21ea74f60761f429144710fc67cadba25fdf260c282d60a2a99",
    value: "1000010000",
    payload: ""
  };
  const rsp6 = await sdkClient.sendSignedTransaction(
    txRow,
    "0x56d1246cbb661dbe8136de7eb146905fb37c40211d520df817ffced2d31611e1",
    1
  );
  console.log("sendSignedTransaction", rsp6);

  //部署合约 contractSend
  const txContract = {
    nonce: "14", //nonce 要通过getAccount获取 账户内显示nonce即为下次交易的nonce值
    gasPrice: "1",
    gasLimit: "1500000", //部署合约limit设置可以大点
    receivingAddress: "", //部署合约接收地址为空
    value: "0",
    payload: codeParams.codeByte //合约的二进制编码，需要在remix上进行编写验证然后编码复制出来
  };
  const rsp7 = await sdkClient.deploy(
    txContract,
    "0x56d1246cbb661dbe8136de7eb146905fb37c40211d520df817ffced2d31611e1",
    1
  );
  console.log("deploy:", rsp7);

  //调用合约方法 修改合约变量的值
  const rsp8 = await sdkClient.contractSend(
    codeParams.contractAddress,
    "setValue",
    `["name","wsd"]`,// 批量设置 ：`[["name","age","gender"],["wsd","27","man"]]`
    "0x56d1246cbb661dbe8136de7eb146905fb37c40211d520df817ffced2d31611e1",
    codeParams.codeStr,
    "15",
    1
  );
  console.log("contractSend:", rsp8);

  //查询合约里面的值
  const params9 = [
    codeParams.codeStr,//合约代码的字符串
    "getValue",
    `["name"]`, //批量查询：`[["name","age","gender"]]`
    "0x59d18E689D90B65392f7E1Fe84ff23613c476A34",
    codeParams.contractAddress,//合约地址
    blockParam
  ];
  const rsp9 = await sdkClient.contractCall(params9);
  console.log("contractCall:", rsp9);
};
example();

//解析出区块hash的过程
// const result = JSON.parse(rsp1).body;
// const blockJson = JSON.stringify(result);
// const block = jsonCodec.decodeBlock(blockJson); //decode json into 'Block'
// const bytes = binaryCodec.encodeBlockHeader(block.header); // encode block header into bytes(rlp)
// const hash = hasher.kec256(bytes); //calculate keccak256 hash
// console.log("\n\nhash:", hash);

//解析出交易中fromAddress
//const txJson = JSON.stringify(result['body']['transactionList'][0])

//decodeTx => decodeSignedTransaction
// const sigTx = jsonCodec.decodeSignedTransaction(txJson)
// const fromAddress = signer.getSender(sigTx)
// console.log('\n\nfromAddress:', fromAddress)

//解析交易hash
// const bytesTx = binaryCodec.encodeTx(sigTx)
// const hashTx = hasher.kec256(bytesTx)
// console.log('\n\nhashTx:', hashTx)

//解析body里面的ommerList里面的区块
// const ommerBlockHeaderJson = JSON.stringify(result['body']['ommerList'][0])
// const ommerBlockHeader = jsonCodec.decodeBlockHeader(ommerBlockHeaderJson)
// const ommerBytes = binaryCodec.encodeBlockHeader(ommerBlockHeader)
// const ommerHash = hasher.kec256(bytes)