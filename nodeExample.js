const codeParams = require("./params");
const jbokSdk = require("./index");
async function fun() {
  try {
    const api = jbokSdk.init();
    try {
      const resp = await api.block.getBlockHeaderByNumber("10");
      console.log("getBlockHeaderByNumber ", resp);
    } catch (e) {
      console.log("getBlockHeaderByNumber:", e);
    }
    const resp1 = await api.block.getBestBlockNumber();
    console.log("getBestBlockNumber ", resp1);

    const resp_2 = await api.account.getBalance(
      "0xa9f26854C08E6A707c9378839C24B5c085F8cE11"
    );
    console.log("getBalance", resp_2);

    const resp_3 = await api.account.getAccount(
      "0xa9f26854C08E6A707c9378839C24B5c085F8cE11"
    );
    console.log("getAccount", resp_3);

    const resp4 = await api.transaction.getReceipt(
      "027f409da65c03ce0db7c9988706a729f855acb219d90c8035fd1d3a57ce3b6d"
    );
    console.log("getReceipt", resp4);

    // 发起交易
    const txRow = {
      nonce: "0", //nonce 要通过getAccount获取 账户内显示nonce即为下次交易的nonce值
      gasPrice: "1",
      gasLimit: "21000",
      receivingAddress: "0x59d18E689D90B65392f7E1Fe84ff23613c476A34",
      value: "100001000000000",
      payload: ""
    };
    const stx = api.utils.signTx(
      txRow,
      "0x56d1246cbb661dbe8136de7eb146905fb37c40211d520df817ffced2d31611e1",
      '10'
    );
    const resp5 = await api.transaction.sendTx(stx);
    console.log("resp5", resp5);

    // 部署合约
    const contractTx = {
      nonce: "4",
      gasPrice: "1",
      gasLimit: "1500000",
      receivingAddress: '',
      value: "0",
      payload: codeParams.code1Byte
    };
    const contractStx = api.utils.signTx(contractTx,'0x56d1246cbb661dbe8136de7eb146905fb37c40211d520df817ffced2d31611e1',10)
    const resp6 = await api.transaction.sendTx(contractStx);

    console.log('resp6:',resp6);

    // 调用合约
    const contractStr = api.utils.contractParser.parse(codeParams.code1Str);
    const contractJsonObj = JSON.parse(contractStr);
    if (contractJsonObj && contractJsonObj.error === "") {
      const contractObj = api.utils.jsonCodec.decodeContracts(
        JSON.stringify(contractJsonObj.contracts)
      );
      /**
       * contractObj.encode(contractName:String,method:String,params:String)
       */
      const payload = contractObj.encode("TokenERC20", "transfer", `["0x59d18E689D90B65392f7E1Fe84ff23613c476A34",10000000]`);
      console.log("payload:", payload);
      const contractTx = {
        nonce: "5",
        gasPrice: "1",
        gasLimit: "1500000",
        receivingAddress: codeParams.contract1Address,
        value: "0",
        payload: payload
      };

      const contractStx = api.utils.signTx(
        contractTx,
        "0x56d1246cbb661dbe8136de7eb146905fb37c40211d520df817ffced2d31611e1",
        10
      );
      const resp7 = await api.transaction.sendTx(contractStx);
      console.log("resp7:", resp7);
    } else {
      console.log("contractParseError:", contractJsonObj.error);
    }

    //查询合约
    const contractStr1 = api.utils.contractParser.parse(codeParams.code1Str);
    const contractJsonObj1 = JSON.parse(contractStr1);
    if (contractJsonObj1 && contractJsonObj1.error === "") {
      const contractObj1 = api.utils.jsonCodec.decodeContracts(
        JSON.stringify(contractJsonObj1.contracts)
      );
      const data = contractObj1.encode(
        "TokenERC20",
        "balanceOf",
        `["0x59d18E689D90B65392f7E1Fe84ff23613c476A34"]`
      );
      console.log("data:", data);
      // call合约
      const callTx = {
        from: "0x59d18E689D90B65392f7E1Fe84ff23613c476A34",
        to: codeParams.contract1Address,
        // gas: Option[BigInt],
        gasPrice: "0",
        value: "0",
        data: data
      };
      const resp8 = await api.contract.call(callTx);
      console.log("resultby:", JSON.parse(resp8).result);
      /**
       * contractObj.decode(contractName:String,method:String,params:String)
       * params 传call返回的值
       */
      const result = contractObj1.decode(
        "TokenERC20",
        "balanceOf",
        JSON.parse(resp8).result
      );
      console.log("result:", JSON.parse(result)[0]);
    }

    // 获取地址的交易记录
    const resp9 = await api.account.getTransactions(
      "0xa9f26854C08E6A707c9378839C24B5c085F8cE11"
    );
    console.log("resp9", resp9);
  } catch (err) {
    console.log("err", err);
  }
}

fun();
