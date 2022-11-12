const Moralis = require("moralis").default
const { EvmChain } = require("@moralisweb3/evm-utils")

const dateTransformer = require("./dateToBlock")

require('dotenv').config()


const MORALIS_API_KEY = process.env.MORALIS_API


async function startMoralis() {

    await Moralis.start({
        apiKey: MORALIS_API_KEY,
        // ...and any other configuration
      });
}

const chain = EvmChain.ETHEREUM


async function getListAddressesForToken(addressToken, fromBlock, toBlock) {

    var arrAddresses = [];
    let cursor = null;
    var length = 0;

    do {
        console.log("manta is gay")
        const response = await Moralis.EvmApi.transaction.getWalletTransactions({
            address: addressToken,
            chain,
            fromBlock: fromBlock,
            toBlock: toBlock,
            cursor: cursor,
        });


    // This is arr of the objects with the needed data     
    const result = response.data.result

    length = response.data.total


    // Extract addresses that bought from transactions
    result.map( element => arrAddresses.push(element.from_address));


    cursor = response.data.cursor;



    } while(cursor != "" && cursor != null) 
    
    
    // console.log(arrAddresses)
    return arrAddresses;
}


function getIntersection(a, b) {
    const set1 = new Set(a);
    const set2 = new Set(b);
  
    const intersection = [...set1].filter(
      element => set2.has(element)
    );
  
    return intersection;
  }


async function main() {
    // Start Moralis API connection
    startMoralis()
    

    // Transform the first intervals dates to blocks
    const firstIntervalDate1 = '2022-10-10'
    const firstIntervalDate2 = "2022-10-14"
    const firstIntervalFromBlock = await dateTransformer.convertDateToBlock(firstIntervalDate1);
    const firstIntervaltoBlock = await dateTransformer.convertDateToBlock(firstIntervalDate2);
    const firstIntervalTokenAddress = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"



    // Transform the second interval dates to blocks
    const secondIntervalDate1 = '2022-10-10'
    const secondIntervalDate2 = "2022-10-15"
    const secondIntervalFromBlock = await dateTransformer.convertDateToBlock(secondIntervalDate1);
    const secondIntervalToBlock = await dateTransformer.convertDateToBlock(secondIntervalDate2);
    const secondIntervalTokenAddress = "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2"



    // Get wallet addresses
    const [firstIntervalWalletAddresses, secondIntervalWalletAddresses] = await Promise.all([
        getListAddressesForToken(firstIntervalTokenAddress, firstIntervalFromBlock, firstIntervaltoBlock),
        getListAddressesForToken(secondIntervalTokenAddress, secondIntervalFromBlock, secondIntervalToBlock)
    ])


    
    const commonWallets = getIntersection(firstIntervalWalletAddresses, secondIntervalWalletAddresses)

    console.log(commonWallets)

}


try {

   main()

}catch(e) {
    console.error(e)
}