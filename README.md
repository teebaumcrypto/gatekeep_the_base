# gatekeep_the_base
Gatekeeping winning to only 6 nations, but advertising it for everyone

https://www.coinbase.com/bounty/ethdenver23


Script for solving the base challenge by coinbase.
It's quick and dirty and could be done better, but meh.

### NOTES

I am in no way a javascript dev, it's just for fun.

that's why there is an init() function, because we make async calls.

I do not know how ethers resolves wallet connect, so use only TEST-private-keys

I did the challenge by copying other "winners", to find the solution for the messages to be hashes
you could also load the abi from the contract and then execute the functions, so you don't have to deal with calldata manipulation

### Usage

- Install ethers via npm or any other package manager
- Insert your privateKey in the const privateKey (only use these for testnets) 
- edit provider_string with a provider of your choice for base

run the script in the console with:

node solver.js
