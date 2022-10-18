const xrpl = require("xrpl");

// Example credentials please replace for your secret key
const wallet = xrpl.Wallet.fromSeed("sXXXXXXX")
console.log(wallet.address) // this is the derived public key 



// Wrap code in an async function so we can use await
async function main() {

    // Define the network client
    const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
    await client.connect()
  
    // Prepare transaction -------------------------------------------------------
    const prepared = await client.autofill({
    "TransactionType": "NFTokenMint",
    "Account": "rKv4pWoXWdPoYg9ymtqDZEQjE6BFQRKerH",
    "TransferFee": 100,
    "NFTokenTaxon": 0,
    "Flags": 8,
    "Fee": "10",
    "URI": xrpl.convertStringToHex("ipfs://QmPYF69z4p4jKCVsRGi6dVPdaAcNGEY5EeymXBK4MYYcVS"),
    "Memos": [
          {
              "Memo": {
                  "MemoType":
                    "687474703A2F2F6578616D706C652E636F6D2F6D656D6F2F67656E65726963",
                  "MemoData": "72656E74"
              }
          }
      ]
    
  })
 

  const max_ledger = prepared.LastLedgerSequence
  const fees = prepared.Flags
  console.log("Prepared transaction instructions:", prepared)
  console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP")
  console.log("Transaction expires after ledger:", max_ledger)
  console.log("Transaction expires after ledger:", fees)

  // Sign prepared instructions ------------------------------------------------
  // Sign prepared instructions ------------------------------------------------
  const signed = wallet.sign(prepared)
  console.log("Identifying hash:", signed.hash)
  console.log("Signed blob:", signed.tx_blob)
  // Submit signed blob --------------------------------------------------------

  try {
    const submit_result = await client.submitAndWait(signed.tx_blob)
    // submitAndWait() doesn't return until the transaction has a final result.
    // Raises XrplError if the transaction doesn't get confirmed by the network.
    // Does not handle disaster recovery.
    console.log("Transaction result:", submit_result)
  } catch(err) {
    console.log("Error submitting transaction:", err)
  }

  // Disconnect when done (If you omit this, Node.js won't end the process)
  client.disconnect()
}
  
  

main()