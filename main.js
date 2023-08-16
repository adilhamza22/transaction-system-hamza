const uuid = require('uuid');
const randomString1 = uuid.v4().substring(0, 12);

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

//perform intermediary calculations
async function performCalculation (sender_name, receiver_name, amount ,findRate,getCurr){
    debugger
    let senderCurr = await getCurr(sender_name);
    console.log(senderCurr,"senderCurr");
    let sender = users.find(item => item.name == sender_name);
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
    let transactionObject = {};
    transactionObject.sender_id = senderID;
    transactionObject.receiver_id = receiverID;
    transactionObject.amount = amount;
    transactionObject.currency = senderCurrencyObj.currency;
    transactionObject.transaction_id = uuid.v4().substring(0, 12);
    transactionObject.exchange_rate_fee = senderCurrencyObj.exchange_rate_fee;
    if(senderCurr.code == recvCurr.code){
        transactionObject.fee_in_amount = 0;
    }
    else{
        console.log(senderCurr.code,recvCurr.code, typeof senderCurr.code, typeof recvCurr.code);
        let convRate = await findRate(senderCurr.currency,recvCurr.currency);
        console.log(convRate,"convRate");
        if(!convRate){
            console.log("Invalid Currency Code, try again");
        }
        transactionObject.fee_in_amount = Number(convRate) * Number(amount);
        // transactionObject.exchange_rate_fee = await applyConversionRate(amount,)
    }
    console.log(transactionObject);
    let balance = await checkBalance(sender_name);
    if(transactionObject.amount + transactionObject.fee_in_amount > balance ){
        console.log("Insufficient Balance");
        return;
    }
    transactions.push(transactionObject);//but first check balance
};
async function applyExchangeRate  (amount, exchange_rate) {
    return amount = amount - exchange_rate;
};
async function applyConversionRate (amount, conversionRate){
    return amount = amount * conversionRate;
}
// getCurrency("John").then((currency) => {console.table(currency)}).catch((err) => {console.log(err)});
// performCalculation("Mango", "Alice", getTransferDetails, getCurrency).then((currency) => {console.table(currency)}).catch((err) => {console.log(err)});

// let y = JSON.parse(conversionRates);
for(x of conversionRates){
    console.table(x);
}
// Object.entries(conversionRates);
//  for (let x in conversionRates){
//     //  console.log(Object.entries(conversionRates[x]));
//     //  console.log(Object.entries(conversionRates[0]).find(([key, value]) => key === "USD"));
//     if(Object.entries(conversionRates[x]).find(([key, value]) => key === "USD")){
//         console.log("found",value);
//     }
// }
// console.log(Object.entries(conversionRates[0]).find((key, value) => key === "USD"));
// Object.entries(conversionRates[0]).find(([key, value]) => {
//     if(key == "USD"){       
//         console.log("found");
//         value.forEach( (element,index) => {
//             if(value[index].hasOwnProperty("EUR")){
//             console.log(element["EUR"],index);
//         }
//         })
//     }
// })


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


// let ans = findConversionRate("USD","AUD");
// console.log(ans);
performCalculation("Alice","Bob",10000,findConversionRate,getCurrency).then((value) => {console.table(value)}).catch((err) => {console.log(err)});