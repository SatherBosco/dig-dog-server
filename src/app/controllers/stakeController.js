require("dotenv").config();

const express = require('express');
const authMiddleware = require('../middlewares/auth');

const gameSettings = require('../../config/gameSettings.json')

const Dog = require('../models/Dog');
const BuyDog = require('../models/BuyDog');
const Stake = require('../models/Stake');
const User = require('../models/User');

const router = express.Router();

router.use(authMiddleware);

async function mintStake(userId, amount, stakeId) {
    try {
        let buyDog;

        const buyDogDate = await BuyDog.findOne({ user: userId }).sort({ 'createdAt': -1 }).limit(1);

        if (buyDogDate !== null) {
            if (!buyDogDate.paid) {
                if ((new Date(buyDogDate.createdAt).getTime() + 1200000) > new Date().getTime() && buyDogDate.stake === true) { // ADICIONAR VARIAVEL PARA A DATA
                    if ((new Date(buyDogDate.createdAt).getTime() + 600000) > new Date().getTime()) { // ADICIONAR VARIAVEL PARA A DATA
                        buyDog = buyDogDate;
                        return buyDog;
                    } else {
                        return {};
                    }
                }
            }
        }

        const { transactionId } = await BuyDog.findOne({}).sort({ 'transactionId': -1 }).limit(1);
        const user = await User.findOne({ _id: userId });

        const newTransactionId = transactionId + 1;

        const NODE_URL = 'https://bsc-dataseed.binance.org/';
        const provider = new ethers.providers.JsonRpcProvider(NODE_URL);

        const _contract = '0x6576243556394759470B4370dA5C4EB655542F10';
        const SmartContractBuyDogObj = new ethers.Contract(
            _contract,
            SmartContractBuyDog,
            provider
        );

        const _recipient = user.wallet.toString();
        const _amount = amount;

        const _transactionId = parseInt(newTransactionId);
        _date = parseInt(new Date().getTime() / 1000);
        let buyDogTransaction = await SmartContractBuyDogObj.getMessage(
            _recipient,
            _amount,
            _transactionId,
            _date,
            _contract
        );

        const private = process.env.PRIVATE_KEY;
        const signer = new ethers.Wallet(private);

        sigMessage = await signer.signMessage(ethers.utils.arrayify(buyDogTransaction));

        let buyDogObj = {
            'transactionId': newTransactionId,
            'paid': false,
            'user': userId,
            'signature': sigMessage,
            'amount': _amount.toString(),
            'date': _date,
            'stake': true,
            'stakeId': stakeId
        }

        buyDog = await BuyDog.create(buyDogObj);

        console.log(_recipient,
            _amount,
            _transactionId,
            _date,
            _contract, sigMessage, buyDogTransaction
        );

        return buyDog;
    } catch (err) {
        return {};
    }
}

router.get('/', async (req, res) => {
    try {
        const stakes = await Stake.find({ user: req.userId });
        return res.send({ msg: 'OK', stakes });
    } catch (err) {
        return res.status(400).send({ msg: 'Erro no servidor ao visualizar os stakes.' });
    }
});

router.post('/', async (req, res) => {
    const { dog1, dog2, dog3, dog4, dog5, dog6, dog7, dog8, dog9, dog10 } = req.body;
    try {
        const dogDb1 = await Dog.findOne({ dogId: dog1 });
        const dogDb2 = await Dog.findOne({ dogId: dog2 });
        const dogDb3 = await Dog.findOne({ dogId: dog3 });
        const dogDb4 = await Dog.findOne({ dogId: dog4 });
        const dogDb5 = await Dog.findOne({ dogId: dog5 });
        const dogDb6 = await Dog.findOne({ dogId: dog6 });
        const dogDb7 = await Dog.findOne({ dogId: dog7 });
        const dogDb8 = await Dog.findOne({ dogId: dog8 });
        const dogDb9 = await Dog.findOne({ dogId: dog9 });
        const dogDb10 = await Dog.findOne({ dogId: dog10 });

        if (dogDb1.status !== 'stake' && dogDb1.hungry > new Date() && dogDb1.thirst > new Date()
            && dogDb2.status !== 'stake' && dogDb2.hungry > new Date() && dogDb2.thirst > new Date()
            && dogDb3.status !== 'stake' && dogDb3.hungry > new Date() && dogDb3.thirst > new Date()
            && dogDb4.status !== 'stake' && dogDb4.hungry > new Date() && dogDb4.thirst > new Date()
            && dogDb5.status !== 'stake' && dogDb5.hungry > new Date() && dogDb5.thirst > new Date()
            && dogDb6.status !== 'stake' && dogDb6.hungry > new Date() && dogDb6.thirst > new Date()
            && dogDb7.status !== 'stake' && dogDb7.hungry > new Date() && dogDb7.thirst > new Date()
            && dogDb8.status !== 'stake' && dogDb8.hungry > new Date() && dogDb8.thirst > new Date()
            && dogDb9.status !== 'stake' && dogDb9.hungry > new Date() && dogDb9.thirst > new Date()
            && dogDb10.status !== 'stake' && dogDb10.hungry > new Date() && dogDb10.thirst > new Date()) {
            dogDb1.status = 'stake';
            dogDb1.statusTime = new Date();
            await dogDb1.save();

            dogDb2.status = 'stake';
            dogDb2.statusTime = new Date();
            await dogDb2.save();

            dogDb3.status = 'stake';
            dogDb3.statusTime = new Date();
            await dogDb3.save();

            dogDb4.status = 'stake';
            dogDb4.statusTime = new Date();
            await dogDb4.save();

            dogDb5.status = 'stake';
            dogDb5.statusTime = new Date();
            await dogDb5.save();

            dogDb6.status = 'stake';
            dogDb6.statusTime = new Date();
            await dogDb6.save();

            dogDb7.status = 'stake';
            dogDb7.statusTime = new Date();
            await dogDb7.save();

            dogDb8.status = 'stake';
            dogDb8.statusTime = new Date();
            await dogDb8.save();

            dogDb9.status = 'stake';
            dogDb9.statusTime = new Date();
            await dogDb9.save();

            dogDb10.status = 'stake';
            dogDb10.statusTime = new Date();
            await dogDb10.save();

        } else {
            return res.status(400).send({ msg: 'Dog inválido.' });
        }

        var obj = {
            'user': req.userId,
            'dogId1': dog1,
            'dogId2': dog2,
            'dogId3': dog3,
            'dogId4': dog4,
            'dogId5': dog5,
            'dogId6': dog6,
            'dogId7': dog7,
            'dogId8': dog8,
            'dogId9': dog9,
            'dogId10': dog10,
        };
        const stake = await Stake.create(obj);

        return res.send({ msg: 'OK', stake });
    } catch (err) {
        return res.status(400).send({ msg: 'Erro no servidor ao criar um stake.' });
    }
});

router.post('/mint', async (req, res) => {
    const { stakeId } = req.body;
    try {
        const stake = await Stake.findOne({ user: req.userId, _id: stakeId });
        if (!stake) {
            const nowDate = new Date();
            if (stake.lastMint.getTime() + (48 * gameSettings.timeMult) < nowDate.getTime()) {
                const qtde = Math.trunc(((nowDate.getTime() - stake.lastMint.getTime()) / gameSettings.timeMult) / 48);
                const mintDog = await mintStake(req.userId, qtde, stake._id);
                if (mintDog === {}) {
                    return res.status(400).send({ msg: 'Stake fora do horario.' });
                }
            } else {
                return res.status(400).send({ msg: 'Erro no servidor ao dar mint no stake.' });
            }
        }
        return res.send({ msg: 'OK', mintDog });
    } catch (err) {
        return res.status(400).send({ msg: 'Erro no servidor ao dar mint no stake.' });
    }
});

router.get('/cancel', async (req, res) => {
    const { stakeId } = req.body;
    try {
        const stake = await Stake.findOne({ user: req.userId, _id: stakeId });
        if (!stake) {
            const dogsIds = [stake.dogId1, stake.dogId2, stake.dogId3, stake.dogId4, stake.dogId5, stake.dogId6, stake.dogId7, stake.dogId8, stake.dogId9, stake.dogId10];
            for (let i = 0; i < 10; i++) {
                let dog = await Dog.findOne({ dogId: dogsIds[i] });
                dog.status = 'trocou';
                await dog.save();
            }

            await Stake.findOneAndDelete({ user: req.userId, _id: stakeId });
        }
        return res.send({ msg: 'OK' });
    } catch (err) {
        return res.status(400).send({ msg: 'Erro no servidor ao cancelar um stake.' });
    }
});

module.exports = app => app.use('/stake', router);