require("dotenv").config();

const express = require("express");
const cors = require("cors");

const SmartContractDeposit = require("./app/contracts/DDCDeposit.json");
const SmartContractWithdraw = require("./app/contracts/DDCWithdraw.json");
const SmartContractBuyDog = require("./app/contracts/BuyDog.json");
const SmartContractBuyHouse = require("./app/contracts/BuyHouse.json");
const SmartContractWithdrawVesting = require("./app/contracts/WithdrawVesting.json");
const ethers = require("ethers");

const gameSettings = require("./config/gameSettings.json");

const app = express();

const Deposit = require("./app/models/Deposit");
const Withdraw = require("./app/models/Withdraw");
const Account = require("./app/models/Account");
const User = require("./app/models/User");
const BuyDog = require("./app/models/BuyDog");
const BuyHouse = require("./app/models/BuyHouse");
const Stake = require("./app/models/Stake");
const VestingToBone = require("./app/models/VestingToBone");
const Dog = require("./app/models/Dog");

app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    return res.send({ msg: "OK" });
});

app.post("/dog/age", async (req, res) => {
    const { dogId } = req.body;

    if (!dogId) return res.status(400).send({ msg: "Dog ID inválido." });

    var dog = await Dog.findOne({ dogId: dogId });

    return res.send({ msg: "OK", dog });
});

require("./app/controllers/index")(app);

app.listen(3000);

// const listenToEvents = () => {
//     const NODE_URL = "https://autumn-smart-hexagon.bsc.discover.quiknode.pro/d6caa818875386dbc75992800356c1f729645e5f/";
//     const provider = new ethers.providers.JsonRpcProvider(NODE_URL);

//     const SmartContractDepositObj = new ethers.Contract("0xDaE5F14f358398512758fEE9Df8333000Ff344C9", SmartContractDeposit, provider);

//     const SmartContractWithdrawObj = new ethers.Contract("0x742FAC2431ae79A5cf2F73A3EeB67f740411b326", SmartContractWithdraw, provider);

//     const SmartContractBuyDogObj = new ethers.Contract("0x6576243556394759470B4370dA5C4EB655542F10", SmartContractBuyDog, provider);

//     const SmartContractBuyHouseObj = new ethers.Contract("0xCd39122dD289D4DD95b317075F9921A9624BD063", SmartContractBuyHouse, provider);

//     const SmartContractWithdrawVestingObj = new ethers.Contract("0x656A376fCa48D734BcBF78BD177f20B364395Fff", SmartContractWithdrawVesting, provider);

//     SmartContractDepositObj.on("DepositDone", async (payer, amount, transactionId, date) => {
//         console.log(`
//         -- DEPOSIT --
//         From ${payer}
//         Amount ${amount}
//         Id ${transactionId}
//         Date ${date}
//         `);
//         const deposit = await Deposit.findOne({ transactionId: transactionId });
//         if (deposit) {
//             if (!deposit.paid) {
//                 deposit.paid = true;
//                 await deposit.save();

//                 const address = payer.toLowerCase();
//                 const user = await User.findOne({ wallet: address });
//                 const account = await Account.findOne({ user: user._id });
//                 if (account) {
//                     account.bone = account.bone + parseInt(ethers.utils.formatEther(amount));
//                     await account.save();
//                 }
//             }
//         }
//     });

//     SmartContractWithdrawObj.on("WithdrawDone", async (payer, amount, transactionId, date) => {
//         console.log(`
//         -- WITHDRAW --
//         From ${payer}
//         Amount ${amount}
//         Id ${transactionId}
//         Date ${date}
//         `);
//         const withdraw = await Withdraw.findOne({ transactionId: transactionId });
//         if (withdraw) {
//             if (!withdraw.paid) {
//                 withdraw.paid = true;
//                 await withdraw.save();

//                 const address = payer.toLowerCase();
//                 const user = await User.findOne({ wallet: address });
//                 const account = await Account.findOne({ user: user._id });
//                 if (account) {
//                     account.bone = account.bone - parseInt(ethers.utils.formatEther(amount));
//                     await account.save();
//                 }
//             }
//         }
//     });

//     SmartContractBuyDogObj.on("BuyDogDone", async (payer, amount, transactionId, date) => {
//         console.log(`
//         -- BUY DOG --
//         From ${payer}
//         Amount ${amount}
//         Id ${transactionId}
//         Date ${date}
//         `);
//         const buyDog = await BuyDog.findOne({ transactionId: transactionId });
//         if (buyDog) {
//             if (!buyDog.paid) {
//                 buyDog.paid = true;
//                 await buyDog.save();

//                 const address = payer.toLowerCase();
//                 const user = await User.findOne({ wallet: address });
//                 const account = await Account.findOne({ user: user._id });
//                 if (account && buyDog.stake === false) {
//                     account.bone = account.bone - amount * gameSettings.dogPrice;
//                     await account.save();
//                 }

//                 if (buyDog.stake === true) {
//                     const stake = await Stake.findOne({ user: user._id, _id: buyDog.stakeId });
//                     if (stake) {
//                         stake.lastMint = new Date(stake.lastMint.getTime() + 48 * amount * gameSettings.timeMult);
//                         await stake.save();
//                     }
//                 }
//             }
//         }
//     });

//     SmartContractBuyHouseObj.on("BuyHouseDone", async (payer, amount, transactionId, date) => {
//         console.log(`
//         -- BUY HOUSE --
//         From ${payer}
//         Amount ${amount}
//         Id ${transactionId}
//         Date ${date}
//         `);
//         const buyHouse = await BuyHouse.findOne({ transactionId: transactionId });
//         if (buyHouse) {
//             if (!buyHouse.paid) {
//                 buyHouse.paid = true;
//                 await buyHouse.save();

//                 const address = payer.toLowerCase();
//                 const user = await User.findOne({ wallet: address });
//                 const account = await Account.findOne({ user: user._id });
//                 if (account) {
//                     account.bone = account.bone - amount * gameSettings.housePrice;
//                     await account.save();
//                 }
//             }
//         }
//     });

//     SmartContractWithdrawVestingObj.on("WithdrawToBoneDone", async (payer, amount, date) => {
//         console.log(`
//         -- WITHDRAW FROM VESTING --
//         From ${payer}
//         Amount ${amount}
//         Date ${date}
//         `);

//         const address = payer.toLowerCase();
//         const user = await User.findOne({ wallet: address });
//         if (user) {
//             const account = await Account.findOne({ user: user._id });
//             if (account) {
//                 account.bone = account.bone + parseInt(ethers.utils.formatEther(amount));
//                 await account.save();

//                 var objVesting = {
//                     user: user._id,
//                 };
//                 await VestingToBone.create(objVesting);
//             }
//         }
//     });
// };

const listenToDepositEvents = () => {
    // NODE 1
    const NODE_URL = "https://warmhearted-weathered-liquid.bsc.discover.quiknode.pro/87122ac161b44b82a198dca9d9d5294126e7f36a/";
    const provider = new ethers.providers.JsonRpcProvider(NODE_URL);

    const SmartContractDepositObj = new ethers.Contract("0xDaE5F14f358398512758fEE9Df8333000Ff344C9", SmartContractDeposit, provider);

    SmartContractDepositObj.on("DepositDone", async (payer, amount, transactionId, date) => {
        console.log(`
        -- DEPOSIT --
        From ${payer}
        Amount ${amount}
        Id ${transactionId}
        Date ${date}
        `);
        const deposit = await Deposit.findOne({ transactionId: transactionId });
        if (deposit) {
            if (!deposit.paid) {
                deposit.paid = true;
                await deposit.save();

                const address = payer.toLowerCase();
                const user = await User.findOne({ wallet: address });
                const account = await Account.findOne({ user: user._id });
                if (account) {
                    account.bone = account.bone + parseInt(ethers.utils.formatEther(amount));
                    await account.save();
                }
            }
        }
    });
};

const listenToWithdrawEvents = () => {
    //NODE 2
    const NODE_URL = "https://young-green-choice.bsc.discover.quiknode.pro/7ca44a167106912ae0eee7222aafd6cb58c6242a/";
    const provider = new ethers.providers.JsonRpcProvider(NODE_URL);

    const SmartContractWithdrawObj = new ethers.Contract("0x742FAC2431ae79A5cf2F73A3EeB67f740411b326", SmartContractWithdraw, provider);

    SmartContractWithdrawObj.on("WithdrawDone", async (payer, amount, transactionId, date) => {
        console.log(`
        -- WITHDRAW --
        From ${payer}
        Amount ${amount}
        Id ${transactionId}
        Date ${date}
        `);
        const withdraw = await Withdraw.findOne({ transactionId: transactionId });
        if (withdraw) {
            if (!withdraw.paid) {
                withdraw.paid = true;
                await withdraw.save();

                const address = payer.toLowerCase();
                const user = await User.findOne({ wallet: address });
                const account = await Account.findOne({ user: user._id });
                if (account) {
                    account.bone = account.bone - parseInt(ethers.utils.formatEther(amount));
                    await account.save();
                }
            }
        }
    });
};

const listenToBuyDogsEvents = () => {
    // NODE 3
    const NODE_URL = "https://bold-yolo-telescope.bsc.discover.quiknode.pro/591f6d5e52a301c37247e655122b0ccf69beda50/";
    const provider = new ethers.providers.JsonRpcProvider(NODE_URL);

    const SmartContractBuyDogObj = new ethers.Contract("0x6576243556394759470B4370dA5C4EB655542F10", SmartContractBuyDog, provider);

    SmartContractBuyDogObj.on("BuyDogDone", async (payer, amount, transactionId, date) => {
        console.log(`
        -- BUY DOG --
        From ${payer}
        Amount ${amount}
        Id ${transactionId}
        Date ${date}
        `);
        const buyDog = await BuyDog.findOne({ transactionId: transactionId });
        if (buyDog) {
            if (!buyDog.paid) {
                buyDog.paid = true;
                await buyDog.save();

                const address = payer.toLowerCase();
                const user = await User.findOne({ wallet: address });
                const account = await Account.findOne({ user: user._id });
                if (account && buyDog.stake === false) {
                    account.bone = account.bone - amount * gameSettings.dogPrice;
                    await account.save();
                }

                if (buyDog.stake === true) {
                    const stake = await Stake.findOne({ user: user._id, _id: buyDog.stakeId });
                    if (stake) {
                        stake.lastMint = new Date(stake.lastMint.getTime() + 48 * amount * gameSettings.timeMult);
                        await stake.save();
                    }
                }
            }
        }
    });
};

const listenToBuyHousesEvents = () => {
    // NODE 4
    const NODE_URL = "https://spring-patient-water.bsc.discover.quiknode.pro/7b9db40a9b8cf0570e9db49219f5ac333a4004ce/";
    const provider = new ethers.providers.JsonRpcProvider(NODE_URL);

    const SmartContractBuyHouseObj = new ethers.Contract("0xCd39122dD289D4DD95b317075F9921A9624BD063", SmartContractBuyHouse, provider);

    SmartContractBuyHouseObj.on("BuyHouseDone", async (payer, amount, transactionId, date) => {
        console.log(`
        -- BUY HOUSE --
        From ${payer}
        Amount ${amount}
        Id ${transactionId}
        Date ${date}
        `);
        const buyHouse = await BuyHouse.findOne({ transactionId: transactionId });
        if (buyHouse) {
            if (!buyHouse.paid) {
                buyHouse.paid = true;
                await buyHouse.save();

                const address = payer.toLowerCase();
                const user = await User.findOne({ wallet: address });
                const account = await Account.findOne({ user: user._id });
                if (account) {
                    account.bone = account.bone - amount * gameSettings.housePrice;
                    await account.save();
                }
            }
        }
    });
};

const listenToWithdrawVestingEvents = () => {
    // NODE 5
    const NODE_URL = "https://young-bitter-cherry.bsc.discover.quiknode.pro/2784673530f61f60a60363c78baba660c88fbc07/";
    const provider = new ethers.providers.JsonRpcProvider(NODE_URL);

    const SmartContractWithdrawVestingObj = new ethers.Contract("0x656A376fCa48D734BcBF78BD177f20B364395Fff", SmartContractWithdrawVesting, provider);

    SmartContractWithdrawVestingObj.on("WithdrawToBoneDone", async (payer, amount, date) => {
        console.log(`
        -- WITHDRAW FROM VESTING --
        From ${payer}
        Amount ${amount}
        Date ${date}
        `);

        const address = payer.toLowerCase();
        const user = await User.findOne({ wallet: address });
        if (user) {
            const account = await Account.findOne({ user: user._id });
            if (account) {
                account.bone = account.bone + parseInt(ethers.utils.formatEther(amount));
                await account.save();

                var objVesting = {
                    user: user._id,
                };
                await VestingToBone.create(objVesting);
            }
        }
    });
};

listenToDepositEvents();
listenToWithdrawEvents();
listenToBuyDogsEvents();
listenToBuyHousesEvents();
listenToWithdrawVestingEvents();
