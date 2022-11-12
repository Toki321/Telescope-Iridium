
const Moralis = require("moralis").default
const { EvmChain } = require("@moralisweb3/evm-utils")
require('dotenv').config()

const chain = EvmChain.ETHEREUM;
const MORALIS_API_KEY_1 = process.env.MORALIS_API

// example
// const date1 = '2022-09-14'
// const date2 = "2022-10-14"

async function convertDateToBlock(dateInput) {
    
    const response = await Moralis.EvmApi.block.getDateToBlock({
        date: dateInput,
        chain: 0x1,
    });
    
    theBlock = response.result.block
    

    return theBlock 
}



// async function main() {

//      let block1 = await convertDateToBlock(date1)
//      let block2 = await convertDateToBlock(date2)

//      console.log(date1, " ", block1)
//      console.log(date2, " ", block2)
// }


// main()



module.exports = { convertDateToBlock }
        