const { ethers, JsonRpcProvider, Transaction } = require('ethers');

// created by teebaum
// NOTES:
// I am in no way a javascript dev, it's just for fun, that's why there is an init() function, because we make async calls
// Insert your privateKey in the const privateKey (only use these for testnets)
// and edit provider_string with a provider of your choice for base
// everything else does the script
// I do not know how ethers resolves wallet connect, so use only TEST-private-keys

// I did the challenge by copying other "winners", to find the solution for the messages to be hashes
// you could also load the abi from the contract and then execute the functions, so you don't have to deal with calldata manipulation

init();

async function init() {
	let provider_string = "https://goerli.base.org"; // or insert your own provider
	let provider = new JsonRpcProvider(provider_string);

	// Init wallet
	const privateKey = 'INSERT YOUR PRIVATE KEY';
	const wallet_pkey = new ethers.Wallet(privateKey);

	// connect wallet with provider
	const wallet = wallet_pkey.connect(provider);

	// print some blockchain infos, so we know we are connected
	let block = await provider.getBlockNumber();
	let nonce = await provider.getTransactionCount(wallet.address);
	console.log("CURRENT BLOCK: " + block);
	console.log("Nonce: " + nonce);

	/* FIRST CHALLENGE */

	// first calldata
	// 0x107302c8
	// 0000000000000000000000000000000000000000000000000000000000000020 // position to look for riddleAnswer (arg1)
	// 0000000000000000000000000000000000000000000000000000000000000006 // Length of RiddleAnswer
	// 6661756365740000000000000000000000000000000000000000000000000000 // RiddleAnswer = faucet
	const calldata_first = "0x107302c8000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000066661756365740000000000000000000000000000000000000000000000000000";

	console.log("***** FIRST CHALLENGE");
	console.log(calldata_first);

	// Create TX
	let first_tx = new Transaction();
	first_tx.data = calldata_first;
	first_tx.to = "0xc1e40f9fd2bc36150e2711e92138381982988791";
	first_tx.value = 0;
	first_tx.chainId = 84531;
	first_tx.gasPrice = 2500000049;
	first_tx.gasLimit = 100000;
	first_tx.nonce = nonce;

	await wallet.sendTransaction(first_tx);
	console.log("first challenge done...");
	// increase nonce after sending
	nonce++;

	/* SECOND CHALLENGE */
	console.log("***** SEC. CHALLENGE");

	// second calldata
	// 0xbf3a215f
	// 0000000000000000000000000000000000000000000000000000000000000040 // position to look for RiddleAnswer (arg1)
	// 0000000000000000000000000000000000000000000000000000000000000080 // position to look for Signature (arg2)
	// 0000000000000000000000000000000000000000000000000000000000000009 // Length of RiddleAnswer (including spaces)
	// 546865204d657267650000000000000000000000000000000000000000000000 // RiddleAnswer = The Merge
	// 0000000000000000000000000000000000000000000000000000000000000041 // Length of Signature = 41 hex = 65 decimal
	// 8a6c75a9eb995c7a1ef74f7c20c5b3b26584d2f0e9c644a939b4bf70ae21eeff // This is the signed hash without 0x
	// 02c61d204ae68ef9e587475f1e4101587432d72342dd0f78db6ad091e30bdf03 // This is the signed hash without 0x
	// 1b00000000000000000000000000000000000000000000000000000000000000 // This is the signed hash without 0x, ending filled with 0's

	const hash_message_second = '0x9c611b41c1f90946c2b6ddd04d716f6ec349ac4b4f99612c3e629db39502b941';
	// Sign the hashed message using ECDSA, this is not compact
	const sign_second = await wallet.signMessage(ethers.getBytes(hash_message_second));

	// make calldata with static + signed msg + static
	let data_pre = "0xbf3a215f000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000009546865204d6572676500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041";
	let data_signed = sign_second.slice(2);
	let data_after = "00000000000000000000000000000000000000000000000000000000000000";

	let calldata_second = data_pre + data_signed + data_after;
	console.log(calldata_second);

	// Create TX
	let second_tx = new Transaction();
	second_tx.data = calldata_second;
	second_tx.to = "0xc1e40f9fd2bc36150e2711e92138381982988791";
	second_tx.value = 0;
	second_tx.chainId = 84531;
	second_tx.gasPrice = 2500000049;
	second_tx.gasLimit = 100000;
	second_tx.nonce = nonce;

	await wallet.sendTransaction(second_tx);
	console.log("second challenge done...");

	// increase nonce after sending
	nonce++;

	/* THIRD CHALLENGE */
	console.log("***** THIRD CHALLENGE - FIRST");

	// the third is 2 transactions
	// first is not compact signed
	// second is compact

	// 0xfd86eca8
	// 0000000000000000000000000000000000000000000000000000000000000060 // position to look for RiddleAnswer (arg1)
	// 000000000000000000000000faaf8288c8a74683b015c9e2ee11b2a762f63e1f // signer argument (arg2)
	// 00000000000000000000000000000000000000000000000000000000000000a0 // position to look for Signature (arg3)
	// 0000000000000000000000000000000000000000000000000000000000000008 // Length of RiddleAnswer
	// 4549502d34383434000000000000000000000000000000000000000000000000 // RiddleAnswer = EIP-4844
	// 0000000000000000000000000000000000000000000000000000000000000041 // Length of Signature = 41 hex = 65 decimal
	// fd0e5b8026a848681a93d827d86284ee17575a3819d65d9d760c1fdf63b83d48 // This is the signed hash without 0x, ending filled with 0's
	// 0977f176b7c293bb156b7b524a049a8ba741b0703773c5b02d308e8cb639d111 // This is the signed hash without 0x, ending filled with 0's
	// 1b00000000000000000000000000000000000000000000000000000000000000 // This is the signed hash without 0x, ending filled with 0's

	const message = '0x3cd65f6089844a3c6409b0acc491ca0071a5672c2ab2a071f197011e0fc66b6a';

	// Sign the hashed message using ECDSA, this is not compact
	const signature = await wallet.signMessage(ethers.getBytes(message));

	// make calldata with statics + dynamic calldata, this uses normal signing
	let third_calldata_1 = "0xfd86eca80000000000000000000000000000000000000000000000000000000000000060000000000000000000000000";
	let third_calldata_2 = wallet.address.slice(2);
	let third_calldata_3 = "00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000084549502d343834340000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000041";
	let third_calldata_4 = signature.slice(2);
	let third_calldata_5 = "00000000000000000000000000000000000000000000000000000000000000";

    let third_calldata_full_1 = third_calldata_1 + third_calldata_2 + third_calldata_3 + third_calldata_4 + third_calldata_5;
	console.log(third_calldata_full_1);

	// Create TX
	let third_tx_1 = new Transaction();
	third_tx_1.data = third_calldata_full_1;
	third_tx_1.to = "0xc1e40f9fd2bc36150e2711e92138381982988791";
	third_tx_1.value = 0;
	third_tx_1.chainId = 84531;
	third_tx_1.gasPrice = 2500000049;
	third_tx_1.gasLimit = 277000;
	third_tx_1.nonce = nonce;

	await wallet.sendTransaction(third_tx_1);
	console.log("third challenge part 1 done...");
	// increase nonce after sending
	nonce++;

	console.log("***** THIRD CHALLENGE - SECOND");

	// 0xfd86eca8
	// 0000000000000000000000000000000000000000000000000000000000000060 // position to look for RiddleAnswer (arg1)
	// 000000000000000000000000faaf8288c8a74683b015c9e2ee11b2a762f63e1f // signer argument (arg2)
	// 00000000000000000000000000000000000000000000000000000000000000a0 // position to look for Signature (arg3)
	// 0000000000000000000000000000000000000000000000000000000000000008 // Length of RiddleAnswer
	// 4549502d34383434000000000000000000000000000000000000000000000000 // RiddleAnswer EIP-4844
	// 0000000000000000000000000000000000000000000000000000000000000040 // Length of Signature = 40 hex = 63 decimal
	// fd0e5b8026a848681a93d827d86284ee17575a3819d65d9d760c1fdf63b83d48 // This is the signed hash without 0x
	// 0977f176b7c293bb156b7b524a049a8ba741b0703773c5b02d308e8cb639d111 // This is the signed hash without 0x

	// We need to make it a signature class object to access "compactSerialized"
	let sig = ethers.Signature.from(signature);
	let com = sig.compactSerialized;

	// make calldata with statics + dynamic calldata, this uses compact signing
	let third_call_1 = "0xfd86eca80000000000000000000000000000000000000000000000000000000000000060000000000000000000000000";
	let third_call_2 = wallet.address.slice(2);
	let third_call_3 = "00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000084549502d343834340000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040";
	let third_call_4 = com.slice(2);

	let third_calldata_full_2 = third_call_1 + third_call_2 + third_call_3 + third_call_4;
	console.log(third_calldata_full_2);

	// Create TX
	let third_tx_2 = new Transaction();
	third_tx_2.data = third_calldata_full_2;
	third_tx_2.to = "0xc1e40f9fd2bc36150e2711e92138381982988791";
	third_tx_2.value = 0;
	third_tx_2.chainId = 84531;
	third_tx_2.gasPrice = 2500000049;
	third_tx_2.gasLimit = 277000;
	third_tx_2.nonce = nonce;

	await wallet.sendTransaction(third_tx_2);
	console.log("third challenge part 2 done...");
	console.log("EVERYTHING COMPLETE");
}
