const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/a7982ca1dd3a49d79680f309d310a933"));
web3.eth.getBalance("0xeca9cB7B3C431300eB6E9aD3D401092B07f64139", function(err, result){
   if (err) console.log(err);
   else console.log(web3.utils.fromWei(result, "ether") + " ETH")
});