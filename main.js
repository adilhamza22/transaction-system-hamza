const uuid = require('uuid');
// const randomString1 = uuid.v4().substring(0, 12);

// console.log(randomString1);


const users = [
    {
        name: "Alice",
        age: 30,
        reference: "00D_qwertyha",
        bankDetails: [
           {
                IBAN: "DE123456789",
                accountNumber: 123456,
                balance: 1000,

           }
        ]
    },
    {
        name: "Bob",
        age: 28,
        reference: "01Q_sharxyha",
        bankDetails: [
           {
                IBAN: "DE123456789",
                accountNumber: 124389,
                balance: 970,

           }
        ]
    },
    {
        name: "John",
        age: 25,
        reference: "01X_sharxyha",
        bankDetails: [
           {
                IBAN: "DE123456789",
                accountNumber: 1243019,
                balance: 970,

           }
        ]
    },
    {
        name: "Smith",
        age: 28,
        reference: "01Q_s98u0kyha",
        bankDetails: [
           {
                IBAN: "DE123456789",
                accountNumber: 1249099,
                balance: 850,

           }
        ]
    },
   
];

const conversionRates = [

    {
        "USD": [
            
                {"EUR": 0.85},
                {"AUD": 0.73},
            
        ]
    }
    ,

    {
        "EUR": [
            
                {"USD": 1.95},
                {"AUD": 1.45},
            
        ]
    }
    ,

    {
        "AUD": [
            
                {"EUR": 2.75},
                {"USD": 2.25},
            
        ]
    }
    ,
];

const currencies = [
    {
        currency: "USD",
        code:"00D",
        exchange_rate_fee: 2.0
    },
    {
        currency: "EUR",
        code:"01Q",
        exchange_rate_fee: 1.5
    },
    {
        currency: "AUD",
        code:"01X",
        exchange_rate_fee: 0.75
    }
];
const transactions=[];


// Sample Transaction Object on SUCCESS
// {
//     sender_id = "00D_qwertyha",
//     receiver_id = "01Q_sharxyha",
//     amount = 100,
//     currency = "USD",
//     exchange_rate_fee = 2.0,
//     transaction_id= "12werty7890",
//     fee_in_amount =22.5
// }

// Get transfer details
async function getTransferDetails (sender_name, receiver_name, amount) {
    let sender = users.find(item => item.name == sender_name);
    if(!sender){
        return -1;
    }
    
    let receiver = users.find(item => item.name == receiver_name);
    if(!receiver){
        return -1;
    }
    let currency = currencies.find(item => item.code == currency_code);
    if(!currency){
        return -1;
    }
    let rawAmount = amount;
    if(rawAmount < 0){
        return -1;
    }
};
// Get Currency
async function getCurrency (user_name){
    let user = users.find(item => item.name == user_name);
    if(!user){
        return -1;
    }
    let currency_code = user.reference.split("_")[0];
    let currency = currencies.find(item => item.code == currency_code);
    return currency;
};
var tranSuccess;
//perform intermediary calculations
async function performCalculation (sender_name, receiver_name, amount ,findRate,getCurr){
    var receiptObject = {};
    tranSuccess= false;
    let senderCurr = await getCurr(sender_name);
    // console.log(senderCurr,"senderCurr");
    let sender = users.find(item => item.name == sender_name);
    if(sender_name == receiver_name){
        console.log("Sender and Receiver Should be Different!");
        return;
    }
    if(!sender){
        console.log("Sender not found")
        return;
    }
    let senderID = sender.reference.split("_")[1];
    let receiver = users.find(item => item.name == receiver_name);
    if(!receiver){
        console.log("Receiver not found");
        return;
    }
    let receiverID = receiver.reference.split("_")[1];
    let recvCurr = await getCurr(receiver_name);
    if(!senderCurr) {
        console.log("Sender not found")
        return;
    };
    if(!recvCurr) {
        console.log("Receiver not found");
        return;
    }
    let senderCurrencyObj = await getCurr(sender_name);
    if(!senderCurrencyObj) {
        console.log("Sender currency details not found");
        return;
    }
    if(amount<=0){
        console.log("Invalid amount");
        return;
    }
    let transactionObject = {};
    transactionObject.sender_id = sender.reference;
    transactionObject.receiver_id = receiver.reference;
    transactionObject.amount = amount;
    transactionObject.currency = senderCurrencyObj.currency;
    transactionObject.transaction_id = uuid.v4().substring(0, 12);
    transactionObject.exchange_rate_fee = senderCurrencyObj.exchange_rate_fee;
    if(senderCurr.code == recvCurr.code){
        transactionObject.fee_in_amount = 0;
    }
    else{
        let convRate = await findRate(senderCurr.currency,recvCurr.currency);
        if(!convRate){
            console.log("Invalid Currency Code, try again");
        }
        transactionObject.fee_in_amount = Number(convRate) * Number(amount);
        // transactionObject.exchange_rate_fee = await applyConversionRate(amount,)
    }
    console.log("Current Transaction in Process:",transactionObject);
    let balance = await checkBalance(sender_name);
    if(transactionObject.exchange_rate_fee + transactionObject.amount + transactionObject.fee_in_amount > balance ){
        console.log("Insufficient Balance");
        return;
    }
    else{
        //push new amount in receiver account
        users.forEach((item,index) => {
            if(item.name == sender_name){
                item.bankDetails[0].balance =item.bankDetails[0].balance - (transactionObject.exchange_rate_fee + transactionObject.amount + transactionObject.fee_in_amount);
            }
            if(item.name == receiver_name){
                item.bankDetails[0].balance = item.bankDetails[0].balance + transactionObject.amount*transactionObject.fee_in_amount;
            }
                receiptObject.sender_id = sender.reference;
                receiptObject.SenderName = sender.name;
                receiptObject.bankDetails = sender.bankDetails;
                receiptObject.receiver_id = receiver.reference;
                receiptObject.ReceiverName = receiver.name;
                receiptObject.transferredAmount = transactionObject.amount;
                receiptObject.exchange_rate_fee = transactionObject.exchange_rate_fee;
                receiptObject.ConversionFees = transactionObject.fee_in_amount;
                receiptObject.transaction_id = transactionObject.transaction_id;
                receiptObject.SenderCurrency = transactionObject.currency;
                receiptObject.SenderBalance = item.bankDetails[0].balance;
                receiptObject.ReceiverCurrency = recvCurr.currency;
                receiptObject.receiverBalance = receiver.bankDetails[0].balance;
                tranSuccess =true;
        });
        console.table(receiptObject);

    }
    transactions.push(transactionObject);
};
async function applyExchangeRate  (amount, exchange_rate) {
    return amount = amount - exchange_rate;
};
async function applyConversionRate (amount, conversionRate){
    return amount = amount * conversionRate;
}



async function checkBalance(sender_name){
    let user = users.find((item)=> item.name == sender_name);
    if(user){
        return user.bankDetails[0].balance; // bankdetails has only one object at index 0
    } 
    else{
        return undefined;
    }
}



function findConversionRate(sCurrCode,rCurrCode){
    let ans;
    if(sCurrCode == rCurrCode){
        return 0;
    }
    for(x in conversionRates){
        Object.entries(conversionRates[x]).find(([key, value]) => {
            if(key==sCurrCode){
                value.forEach( (item,index) => {
                    if(item.hasOwnProperty(rCurrCode)){
                        // console.log(item[rCurrCode],index);
                        ans = item[rCurrCode];
                    }
                })
            }
        });
    }
    return ans;
}

setTimeout(()=>{
        performCalculation("Alice","Alice",700,findConversionRate,getCurrency);
        if(tranSuccess==true){
            setTimeout(()=>{
                console.log("Transaction Successful!");
                console.table(transactions);
            },3000);
        }
    
},3000);
console.log("Transaction in Process . . . ");
