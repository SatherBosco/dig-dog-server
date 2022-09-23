require("dotenv").config();

const express = require("express");
const authMiddleware = require("../middlewares/auth");

const gameSettings = require("../../config/gameSettings.json");

const ethers = require('ethers');
const SmartContractBuyDog = require('../contracts/BuyDog.json');

const Dog = require("../models/Dog");
const BuyDog = require("../models/BuyDog");
const Stake = require("../models/Stake");
const User = require("../models/User");

const router = express.Router();

router.use(authMiddleware);

async function mintStake(userId, amount, stakeId) {
    try {
        let buyDog;

        const buyDogDate = await BuyDog.findOne({ user: userId }).sort({ createdAt: -1 }).limit(1);

        if (buyDogDate !== null) {
            if (!buyDogDate.paid) {
                if (new Date(buyDogDate.createdAt).getTime() + 1200000 > new Date().getTime() && buyDogDate.stake === true) {
                    // ADICIONAR VARIAVEL PARA A DATA
                    if (new Date(buyDogDate.createdAt).getTime() + 600000 > new Date().getTime()) {
                        // ADICIONAR VARIAVEL PARA A DATA
                        buyDog = buyDogDate;
                        return buyDog;
                    } else {
                        return {};
                    }
                }
            }
        }

        const { transactionId } = await BuyDog.findOne({}).sort({ transactionId: -1 }).limit(1);
        const user = await User.findOne({ _id: userId });

        const newTransactionId = transactionId + 1;

        const NODE_URL = "https://bsc-dataseed.binance.org/";
        const provider = new ethers.providers.JsonRpcProvider(NODE_URL);

        const _contract = "0x6576243556394759470B4370dA5C4EB655542F10";
        const SmartContractBuyDogObj = new ethers.Contract(_contract, SmartContractBuyDog, provider);

        const _recipient = user.wallet.toString();
        const _amount = amount;

        const _transactionId = parseInt(newTransactionId);
        _date = parseInt(new Date().getTime() / 1000);
        let buyDogTransaction = await SmartContractBuyDogObj.getMessage(_recipient, _amount, _transactionId, _date, _contract);

        const private = process.env.PRIVATE_KEY;
        const signer = new ethers.Wallet(private);

        sigMessage = await signer.signMessage(ethers.utils.arrayify(buyDogTransaction));

        let buyDogObj = {
            transactionId: newTransactionId,
            paid: false,
            user: userId,
            signature: sigMessage,
            amount: _amount.toString(),
            date: _date,
            stake: true,
            stakeId: stakeId,
        };

        buyDog = await BuyDog.create(buyDogObj);

        return buyDog;
    } catch (err) {
        return {};
    }
}

router.get("/", async (req, res) => {
    try {
        const stakes = await Stake.find({ user: req.userId });
        return res.send({ msg: "OK", stakes });
    } catch (err) {
        return res.status(400).send({ msg: "Erro no servidor ao visualizar os stakes." });
    }
});

router.post("/", async (req, res) => {
    const { dogId1, dogId2, dogId3, dogId4, dogId5, dogId6, dogId7, dogId8, dogId9, dogId10 } = req.body;
    try {
        const dogDb1 = await Dog.findOne({ dogId: dogId1, user: req.userId });
        const dogDb2 = await Dog.findOne({ dogId: dogId2, user: req.userId });
        const dogDb3 = await Dog.findOne({ dogId: dogId3, user: req.userId });
        const dogDb4 = await Dog.findOne({ dogId: dogId4, user: req.userId });
        const dogDb5 = await Dog.findOne({ dogId: dogId5, user: req.userId });
        const dogDb6 = await Dog.findOne({ dogId: dogId6, user: req.userId });
        const dogDb7 = await Dog.findOne({ dogId: dogId7, user: req.userId });
        const dogDb8 = await Dog.findOne({ dogId: dogId8, user: req.userId });
        const dogDb9 = await Dog.findOne({ dogId: dogId9, user: req.userId });
        const dogDb10 = await Dog.findOne({ dogId: dogId10, user: req.userId });

        const nowDate = new Date();

        if (dogDb1 &&
            dogDb1.status !== "stake" &&
            dogDb1.hungry > nowDate &&
            dogDb1.thirst > nowDate &&
            dogDb2 &&
            dogDb2.status !== "stake" &&
            dogDb2.hungry > nowDate &&
            dogDb2.thirst > nowDate &&
            dogDb3 &&
            dogDb3.status !== "stake" &&
            dogDb3.hungry > nowDate &&
            dogDb3.thirst > nowDate &&
            dogDb4 &&
            dogDb4.status !== "stake" &&
            dogDb4.hungry > nowDate &&
            dogDb4.thirst > nowDate &&
            dogDb5 &&
            dogDb5.status !== "stake" &&
            dogDb5.hungry > nowDate &&
            dogDb5.thirst > nowDate &&
            dogDb6 &&
            dogDb6.status !== "stake" &&
            dogDb6.hungry > nowDate &&
            dogDb6.thirst > nowDate &&
            dogDb7 &&
            dogDb7.status !== "stake" &&
            dogDb7.hungry > nowDate &&
            dogDb7.thirst > nowDate &&
            dogDb8 &&
            dogDb8.status !== "stake" &&
            dogDb8.hungry > nowDate &&
            dogDb8.thirst > nowDate &&
            dogDb9 &&
            dogDb9.status !== "stake" &&
            dogDb9.hungry > nowDate &&
            dogDb9.thirst > nowDate &&
            dogDb10 &&
            dogDb10.status !== "stake" &&
            dogDb10.hungry > nowDate &&
            dogDb10.thirst > nowDate
        ) {
            dogDb1.status = "stake";
            dogDb1.statusTime = nowDate;
            await dogDb1.save();

            dogDb2.status = "stake";
            dogDb2.statusTime = nowDate;
            await dogDb2.save();

            dogDb3.status = "stake";
            dogDb3.statusTime = nowDate;
            await dogDb3.save();

            dogDb4.status = "stake";
            dogDb4.statusTime = nowDate;
            await dogDb4.save();

            dogDb5.status = "stake";
            dogDb5.statusTime = nowDate;
            await dogDb5.save();

            dogDb6.status = "stake";
            dogDb6.statusTime = nowDate;
            await dogDb6.save();

            dogDb7.status = "stake";
            dogDb7.statusTime = nowDate;
            await dogDb7.save();

            dogDb8.status = "stake";
            dogDb8.statusTime = nowDate;
            await dogDb8.save();

            dogDb9.status = "stake";
            dogDb9.statusTime = nowDate;
            await dogDb9.save();

            dogDb10.status = "stake";
            dogDb10.statusTime = nowDate;
            await dogDb10.save();
        } else {
            return res.status(400).send({ msg: "Dog inválido." });
        }

        var obj = {
            user: req.userId,
            dogId1: dogId1,
            dogId2: dogId2,
            dogId3: dogId3,
            dogId4: dogId4,
            dogId5: dogId5,
            dogId6: dogId6,
            dogId7: dogId7,
            dogId8: dogId8,
            dogId9: dogId9,
            dogId10: dogId10,
        };
        await Stake.create(obj);

        const stakes = await Stake.find({ user: req.userId });

        return res.send({ msg: "OK", stakes });
    } catch (err) {
        return res.status(400).send({ msg: "Erro no servidor ao criar um stake." });
    }
});

router.post("/mint", async (req, res) => {
    const { stakeId } = req.body;
    try {
        const stake = await Stake.findOne({ user: req.userId, _id: stakeId });
        if (!stake) return res.status(400).send({ msg: "Stake não encontrado." });

        const nowDate = new Date();
        if (stake.lastMint.getTime() + 48 * gameSettings.timeMult > nowDate.getTime()) return res.status(400).send({ msg: "Stake fora do horario." });

        const qtde = Math.trunc((nowDate.getTime() - stake.lastMint.getTime()) / gameSettings.timeMult / 48);
        const mintDog = await mintStake(req.userId, qtde, stake._id);
        if (mintDog === {}) {
            return res.status(400).send({ msg: "Stake fora do horario." });
        }

        return res.send({ msg: "OK", mintDog });
    } catch (err) {
        return res.status(400).send({ msg: "Erro no servidor ao dar mint no stake." });
    }
});

router.post("/cancel", async (req, res) => {
    const { stakeId } = req.body;
    try {
        const stake = await Stake.findOne({ user: req.userId, _id: stakeId });
        if (stake) {
            const dogsIds = [
                stake.dogId1,
                stake.dogId2,
                stake.dogId3,
                stake.dogId4,
                stake.dogId5,
                stake.dogId6,
                stake.dogId7,
                stake.dogId8,
                stake.dogId9,
                stake.dogId10,
            ];
            const fomeSede = new Date(new Date().getTime() + 5 * 5 * gameSettings.timeMult);
            for (let i = 0; i < 10; i++) {
                let dog = await Dog.findOne({ dogId: dogsIds[i] });
                dog.status = "trocou";
                dog.hungry = fomeSede;
                dog.thirst = fomeSede;
                await dog.save();
            }

            await Stake.findOneAndDelete({ user: req.userId, _id: stakeId });
        }

        const stakes = await Stake.find({ user: req.userId });

        return res.send({ msg: "OK", stakes });
    } catch (err) {
        return res.status(400).send({ msg: "Erro no servidor ao cancelar um stake." });
    }
});

module.exports = (app) => app.use("/stake", router);
