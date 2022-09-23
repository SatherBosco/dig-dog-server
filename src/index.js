require("dotenv").config();

const express = require('express');
// const socket = require('socket.io');
// const http = require('http');
const cors = require('cors');

const SmartContractDeposit = require('./app/contracts/DDCDeposit.json');
const SmartContractWithdraw = require('./app/contracts/DDCWithdraw.json');
const SmartContractBuyDog = require('./app/contracts/BuyDog.json');
const SmartContractBuyHouse = require('./app/contracts/BuyHouse.json');
const SmartContractWithdrawVesting = require('./app/contracts/WithdrawVesting.json');
const ethers = require('ethers');

const gameSettings = require('./config/gameSettings.json');

const app = express();

const Deposit = require('./app/models/Deposit');
const Withdraw = require('./app/models/Withdraw');
const Account = require('./app/models/Account');
const User = require('./app/models/User');
const BuyDog = require('./app/models/BuyDog');
const BuyHouse = require('./app/models/BuyHouse');
const Stake = require('./app/models/Stake');
const VestingToBone = require('./app/models/VestingToBone');

// Add Access Control Allow Origin headers
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    return res.send({ msg: 'OK' });
});

require('./app/controllers/index')(app);

// const httpServer = http.createServer(app);
// const io = socket(httpServer, {
//     path: '/socket.io'
// });

// const clients = [];

// io.on('connection', (client) => {
//     console.log(`Client connected ${client.id}`);
//     clients.push(client);

//     client.on('disconnect', () => {
//         clients.splice(clients.indexOf(client), 1);
//         console.log(`Client disconnected ${client.id}`);
//     });
// });

// app.get('/msg', (req, res) => {
//     const msg = req.query.msg || '';
//     for(const client of clients) {
//         client.emit('msg', msg);
//     }

//     res.json({
//         ok: true
//     });
// });

// const PORT = 5000;

// httpServer.listen(PORT, () => {
//     console.log(`Server started at ${PORT}`);
// })

app.listen(3000);

const listenToEvents = () => {
    const NODE_URL = 'https://bsc-dataseed.binance.org/';
    const provider = new ethers.providers.JsonRpcProvider(NODE_URL);

    const SmartContractDepositObj = new ethers.Contract(
        '0xDaE5F14f358398512758fEE9Df8333000Ff344C9',
        SmartContractDeposit,
        provider
    );

    const SmartContractWithdrawObj = new ethers.Contract(
        '0x742FAC2431ae79A5cf2F73A3EeB67f740411b326',
        SmartContractWithdraw,
        provider
    );

    const SmartContractBuyDogObj = new ethers.Contract(
        '0x6576243556394759470B4370dA5C4EB655542F10',
        SmartContractBuyDog,
        provider
    );

    const SmartContractBuyHouseObj = new ethers.Contract(
        '0xCd39122dD289D4DD95b317075F9921A9624BD063',
        SmartContractBuyHouse,
        provider
    );

    const SmartContractWithdrawVestingObj = new ethers.Contract(
        '0x656A376fCa48D734BcBF78BD177f20B364395Fff',
        SmartContractWithdrawVesting,
        provider
    );

    SmartContractDepositObj.on('DepositDone', async (payer, amount, transactionId, date) => {
        console.log(`
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
                    account.bone = account.bone + (parseInt(ethers.utils.formatEther(amount)));
                    await account.save();
                }
            }
        }
    });

    SmartContractWithdrawObj.on('WithdrawDone', async (payer, amount, transactionId, date) => {
        console.log(`
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
                    account.bone = account.bone - (parseInt(ethers.utils.formatEther(amount)));
                    await account.save();
                }
            }
        }
    });

    SmartContractBuyDogObj.on('BuyDogDone', async (payer, amount, transactionId, date) => {
        console.log(`
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
                    account.bone = account.bone - (amount * gameSettings.dogPrice);
                    await account.save();
                }

                if (buyDog.stake === true) {
                    const stake = await Stake.findOne({ user: user._id, _id: buyDog.stakeId });
                    if (stake) {
                        stake.lastMint = new Date(stake.lastMint.getTime() + qtde * 48 * gameSettings.timeMult);
                        await stake.save();
                    }
                }
            }
        }
    });

    SmartContractBuyHouseObj.on('BuyHouseDone', async (payer, amount, transactionId, date) => {
        console.log(`
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
                    account.bone = account.bone - (amount * gameSettings.housePrice);
                    await account.save();
                }
            }
        }
    });

    SmartContractWithdrawVestingObj.on('WithdrawToBoneDone', async (payer, amount, date) => {
        console.log(`
        From ${payer}
        Amount ${amount}
        Date ${date}
        `);

        const address = payer.toLowerCase();
        const user = await User.findOne({ wallet: address });
        if (user) {
            const account = await Account.findOne({ user: user._id });
            if (account) {
                account.bone = account.bone + (parseInt(ethers.utils.formatEther(amount)));
                await account.save();

                var objVesting = {
                    'user': user._id
                }
                await VestingToBone.create(objVesting);
            }
        }
    });
};

listenToEvents();