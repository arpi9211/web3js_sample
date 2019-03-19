<h1>First Dapp using web3.js</h1>

**Ethereum Node Setup:**

1.	Create a local chain<br />
	**$ populus chain new sample**<br />
	Note: here sample is chain name
2.	Initiate chain<br />
 	**$ chains/sample /./init_chain.sh**
3.	Run the chain<br />
	**$ chains/sample /./run_chain.sh**
4.	Deploy SampleStorage (contract name) contract to sample local chain<br />
    **$ populus deploy --chain sample SampleStorage --no-wait-for-sync**<br />
    (Ex. $ populus deploy --chain chain_name contract_name --no-wait-for-sync)

```Note: When you create a chain and deploy smart contract on chain it will create registrar.json file. This file contain address of smart contract. This address is used to call smart contract function by web3.js. Copy contract address and paste it on server.js file.  ```

If you did everything correctly, then run server.js file<br />
**$ node server.js**
