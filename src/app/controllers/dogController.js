require("dotenv").config();

const Web3 = require('web3');
const SmartContractNFT = require('../contracts/DDCDOG.json');

const ethers = require('ethers');
const SmartContractBuyDog = require('../contracts/BuyDog.json');

const express = require('express');
const authMiddleware = require('../middlewares/auth');

const gameSettings = require('../../config/gameSettings.json');

const User = require('../models/User');
const Account = require('../models/Account');
const Dog = require('../models/Dog');
const House = require('../models/House');
const Room = require('../models/Room')
const Bed = require('../models/Bed');
const BuyDog = require('../models/BuyDog');

const router = express.Router();

router.use(authMiddleware);

async function transferFee(userId, boneFee) {
    let boneFeeAux = boneFee * 0.5;
    try {
        const user0 = await User.findOne({ _id: userId });
        if (user0.userRef !== -1) {
            const user1 = await User.findOne({ id: user0.userRef });
            const account1 = await Account.findOne({ user: user1._id });
            account1.bone = account1.bone + boneFeeAux;
            account1.save();
            boneAux = boneAux * 0.5;

            if (user1.userRef !== -1) {
                const user2 = await User.findOne({ id: user1.userRef });
                const account2 = await Account.findOne({ user: user2._id });
                account2.bone = account2.bone + boneFeeAux;
                account2.save();
                boneAux = boneAux * 0.5;

                if (user2.userRef !== -1) {
                    const user3 = await User.findOne({ id: user2.userRef });
                    const account3 = await Account.findOne({ user: user3._id });
                    account3.bone = account3.bone + boneFeeAux;
                    account3.save();
                    boneAux = boneAux * 0.5;

                    if (user3.userRef !== -1) {
                        const user4 = await User.findOne({ id: user3.userRef });
                        const account4 = await Account.findOne({ user: user4._id });
                        account4.bone = account4.bone + boneFeeAux;
                        account4.save();
                        boneAux = boneAux * 0.5;

                        if (user4.userRef !== -1) {
                            const user5 = await User.findOne({ id: user4.userRef });
                            const account5 = await Account.findOne({ user: user5._id });
                            account5.bone = account5.bone + boneFeeAux;
                            account5.save();
                        }
                    }
                }
            }
        }
        return;
    } catch {
        return;
    }
}

// async function getPenalidade(fomeSede, penalidade, penalidadeDate, cla) {
//     const nowDate = Math.trunc((new Date()).getTime() / 1000);
//     const fomeSedeDate = Math.trunc(fomeSede.getTime() / 1000);
//     const pnDate = Math.trunc(penalidadeDate.getTime() / 1000);

//     let dif = nowDate - fomeSedeDate;

//     const claTime = gameSettings.dogActionTime[cla];
//     const threePoints = (3 * 5 * gameSettings.timeMult) / 1000;
//     let obj = {};
//     if (pnDate + threePoints > nowDate) {
//         obj = {
//             podeAlimentar: true,
//             newFomeSede: pnDate + threePoints,
//             newPenalidadeDate: pnDate,
//             newPenalidade: penalidade
//         };

//         return obj;
//     }

//     let penalidadeMult = 0;

//     let stop = true;
//     while (stop) {
//         penalidade += 1;
//         penalidadeMult = ((penalidade) * 10 * claTime * gameSettings.timeMult) / 1000;
//         let pn = dif / (penalidadeMult + threePoints);
//         if (pn < 1) {
//             stop = false;
//         } else {
//             dif -= penalidadeMult + threePoints;
//         }
//     }

//     const pode = dif > penalidadeMult;
//     obj = {
//         podeAlimentar: pode,
//         newFomeSede: pode ? (nowDate + threePoints + penalidadeMult - dif) : (nowDate - dif),
//         newPenalidadeDate: nowDate - dif + penalidadeMult,
//         newPenalidade: penalidade
//     };

//     return obj;
// }

async function getPenalidade(fome, sede) {
    const nowDate = Math.trunc((new Date()).getTime() / 1000);
    const fomeDate = Math.trunc(fome.getTime() / 1000);
    const sedeDate = Math.trunc(sede.getTime() / 1000);

    var fomeSedeObj = {
        'disponivel': true,
        'mudarFomeSede': false,
        'novoFomeSede': 0
    }

    if (fomeDate < nowDate || sedeDate < nowDate) {
        const diff = nowDate - (fomeDate < sedeDate ? fomeDate : sedeDate);
        const oneDay = 86400; // 24 HORAS
        const oneDayPlusThreeBars = 140400; // 24 HORAS + 15 HORAS (3 BARRAS)

        const restoDaPenalidade = diff % oneDayPlusThreeBars;
        var novoDate = (fomeDate < sedeDate ? fomeDate : sedeDate) + (diff - restoDaPenalidade);

        if (restoDaPenalidade < oneDay)
            fomeSedeObj.disponivel = false;
        else {
            novoDate = novoDate + oneDayPlusThreeBars;
        }

        fomeSedeObj.mudarFomeSede = true;
        fomeSedeObj.novoFomeSede = novoDate;
    }

    return fomeSedeObj;
}

router.get('/', async (req, res) => {
    try {
        // const NODE_URL = 'https://speedy-nodes-nyc.moralis.io/b22571774cee89066f4cf22d/bsc/mainnet';
        const NODE_URL = 'https://bsc-dataseed.binance.org/';
        const provider = new Web3.providers.HttpProvider(NODE_URL);
        const web3 = new Web3(provider);

        const SmartContractNFTObj = new web3.eth.Contract(
            SmartContractNFT,
            '0x90487b4Be33FaF888f4D9145172c11B70B5fF821'
        );

        const { wallet } = await User.findOne({ _id: req.userId });

        // const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
        // const SmartContractNFTObj = new ethers.Contract(
        //     '0x90487b4Be33FaF888f4D9145172c11B70B5fF821',
        //     SmartContractNFT,
        //     provider
        // );
        // var dogsFromBSC = await SmartContractNFTObj.getOwnerDogsId(wallet);
        // await dogsFromBSC.wait();

        var dogsFromBSC;
        await SmartContractNFTObj.methods.getOwnerDogsId(wallet).call(function (error, result) {
            dogsFromBSC = result;
        });

        var dogsFromDB = [];

        if (dogsFromBSC.length !== 0) {
            for (let dog of dogsFromBSC) {
                const dogInDB = await Dog.findOne({ dogId: dog });

                if (dogInDB) {
                    if (dogInDB.user != req.userId) {
                        const fomeSede = new Date(new Date().getTime() + 5 * 5 * gameSettings.timeMult);
                        const changeDog = await Dog.findOneAndUpdate({ dogId: dog }, {
                            '$set': { 'user': req.userId, 'status': 'trocou', 'hungry': fomeSede, 'thirst': fomeSede, 'statusTime': new Date() }
                        }, { new: true });
                        await changeDog.save();

                        dogsFromDB.push(changeDog);
                    } else {
                        const penalidadeVerify = await getPenalidade(dogInDB.hungry, dogInDB.thirst);
                        if (penalidadeVerify.mudarFomeSede) {
                            dogInDB.hungry = new Date(penalidadeVerify.novoFomeSede * 1000);
                            dogInDB.thirst = new Date(penalidadeVerify.novoFomeSede * 1000);
                            await dogInDB.save();
                        }

                        dogsFromDB.push(dogInDB);
                    }
                } else {
                    var dogCode;
                    await SmartContractNFTObj.methods.dogs(dog).call(function (error, result) {
                        dogCode = result.dogCode;
                    });
                    const fomeSede = new Date(new Date().getTime() + 5 * 5 * gameSettings.timeMult);

                    let afinidade = (dogCode % 25) % 5;
                    afinidade = afinidade == 0 ? 4 : afinidade - 1;

                    let cla = (dogCode % 25) - 1;
                    cla = cla == -1 ? 4 : Math.trunc(cla / 5);

                    const raridade = Math.trunc((dogCode - 1) / 25);

                    var obj = {
                        'dogId': dog,
                        'dogCode': dogCode,
                        'rarity': raridade,
                        'affinity': afinidade,
                        'clan': cla,
                        'user': req.userId,
                        'hungry': fomeSede,
                        'thirst': fomeSede,
                        'status': 'disponivel',
                        'statusTime': new Date()
                    };
                    const newDog = await Dog.create(obj);

                    dogsFromDB.push(newDog);
                }
            }
        }

        return res.send({ msg: 'OK', dogsFromDB });
    } catch (err) {
        return res.status(400).send({ msg: 'Error loading dogs' });
    }
});

router.put('/fome/:dogId', async (req, res) => {
    try {
        const dog = await Dog.findOne({ user: req.userId, dogId: req.params.dogId });
        const nowDate = new Date();

        const penalidadeVerify = await getPenalidade(dog.hungry, dog.thirst);
        if (!penalidadeVerify.disponivel)
            return res.send({ msg: 'O dog sofreu uma penalidade por não receber cuidados.', dog });

        if (penalidadeVerify.mudarFomeSede) {
            dog.hungry = new Date(penalidadeVerify.novoFomeSede * 1000);
            dog.thirst = new Date(penalidadeVerify.novoFomeSede * 1000);
            await dog.save();
        }

        const fomeAtual = Math.floor(Math.abs(dog.hungry.getTime() - nowDate.getTime()) / gameSettings.timeMult);

        if (fomeAtual >= 20)
            return res.send({ msg: 'Dog sem fome.' });

        const { food } = await Account.findOne({ user: req.userId });

        const alimentarEm = 4 - Math.floor(fomeAtual / 5);

        if (food < alimentarEm)
            return res.status(400).send({ msg: 'Sem comida.' });

        const newFome = new Date(dog.hungry.getTime() + alimentarEm * 5 * gameSettings.timeMult);

        const account = await Account.findOneAndUpdate({ user: req.userId }, { '$inc': { 'food': -alimentarEm } }, { new: true });
        await account.save();

        dog.hungry = newFome;
        await dog.save();

        return res.send({ msg: 'OK', account, dog });
    } catch (err) {
        return res.status(400).send({ msg: 'Erro no servidor ao alimentar o dog.' });
    }
});

router.put('/sede/:dogId', async (req, res) => {
    try {
        const dog = await Dog.findOne({ user: req.userId, dogId: req.params.dogId });
        const nowDate = new Date();

        const penalidadeVerify = await getPenalidade(dog.hungry, dog.thirst);
        if (!penalidadeVerify.disponivel)
            return res.send({ msg: 'O dog sofreu uma penalidade por não receber cuidados.', dog });

        if (penalidadeVerify.mudarFomeSede) {
            dog.hungry = new Date(penalidadeVerify.novoFomeSede * 1000);
            dog.thirst = new Date(penalidadeVerify.novoFomeSede * 1000);
            await dog.save();
        }

        const sedeAtual = Math.floor(Math.abs(dog.thirst.getTime() - nowDate.getTime()) / gameSettings.timeMult);

        if (sedeAtual >= 20)
            return res.send({ msg: 'Dog sem sede.' });

        const hidratarEm = 4 - Math.floor(sedeAtual / 5);

        const newSede = new Date(dog.thirst.getTime() + hidratarEm * 5 * gameSettings.timeMult);

        dog.thirst = newSede;
        await dog.save();

        return res.send({ msg: 'OK', dog });
    } catch (err) {
        return res.status(400).send({ msg: 'Erro no servidor ao hidratar o dog.' });
    }
});

router.post('/action/:dogId', async (req, res) => {
    try {
        const dog = await Dog.findOne({ user: req.userId, dogId: req.params.dogId });
        const nowDate = new Date();

        const penalidadeVerify = await getPenalidade(dog.hungry, dog.thirst);
        if (!penalidadeVerify.disponivel)
            return res.send({ msg: 'O dog sofreu uma penalidade por não receber cuidados.', dog });

        if (penalidadeVerify.mudarFomeSede) {
            dog.hungry = new Date(penalidadeVerify.novoFomeSede * 1000);
            dog.thirst = new Date(penalidadeVerify.novoFomeSede * 1000);
            await dog.save()
        }

        if (dog.statusTime > nowDate)
            return res.send({ msg: 'Dog ocupado.' });

        const boneCalc = dog.status == 'trocou' ? 0 : Math.ceil(gameSettings.reward[dog.rarity] / (gameSettings.dogBoneIncrPow[dog.clan]));
        const boneIncr = boneCalc * 0.95;
        const boneFee = boneCalc - boneIncr;

        const dogTypeTime = new Date(nowDate.getTime() + (gameSettings.dogActionTime[dog.clan] * gameSettings.timeMult));

        switch (dog.status) {
            case 'disponivel':
            case 'dormindo':
                const { bone } = await Account.findOne({ user: req.userId });

                const transporteTaxa = Math.ceil((gameSettings.reward[dog.rarity] / gameSettings.dogBoneIncrPow[dog.clan]) * 0.05);
                if (bone < transporteTaxa)
                    return res.send({ msg: 'Sem Bone para taxa de transporte.' });

                const account = await Account.findOneAndUpdate({ user: req.userId }, { '$inc': { 'bone': -transporteTaxa } }, { new: true });
                await account.save();

                dog.status = 'cavando';
                dog.statusTime = dogTypeTime;
                await dog.save();

                return res.send({ msg: 'OK', account, dog });
            case 'cavando':
            case 'retornou':
            case 'trocou':
                const { bedId, casaType, roomId, houseId } = req.body;

                const bed = await Bed.findOne({ _id: bedId, user: req.userId });

                if (bed == null)
                    return res.send({ msg: 'Cama inválida.' });

                if (bed.useBedTime > nowDate)
                    return res.send({ msg: 'Cama já em uso.' });

                if (bed.expirationBedTime < dogTypeTime)
                    return res.send({ msg: 'Cama com tempo disponível menor do que o necessário.' });

                if (casaType == "room") {
                    if (roomId == "")
                        return res.send({ msg: 'Quarto inválida.' });

                    const usedRoom = await Room.findOne({ user: req.userId, _id: roomId });

                    if (usedRoom == null)
                        return res.send({ msg: 'Quarto inválida.' });

                    if (usedRoom.useRoomTime > nowDate)
                        return res.send({ msg: 'Quarto já em uso.' });

                    if (new Date(usedRoom.roomStartTime.getTime() + Math.trunc((usedRoom.timeMult * 24.5 * gameSettings.timeMult))) < dogTypeTime)
                        return res.send({ msg: 'Quarto com tempo disponível menor do que o necessário.' });
                } else {
                    if (houseId == "")
                        return res.send({ msg: 'Casa inválida.' });

                    const usedHouse = await House.findOne({ user: req.userId, _id: houseId });

                    if (usedHouse == null)
                        return res.send({ msg: 'Casa inválida.' });

                    if (usedHouse.useHousetime > nowDate)
                        return res.send({ msg: 'Casa já em uso.' });
                }

                const usedBed = await Bed.findOneAndUpdate({ user: req.userId, _id: bedId }, { '$set': { 'useBedTime': dogTypeTime } }, { new: true });
                await usedBed.save();

                dog.status = 'dormindo';
                dog.statusTime = dogTypeTime;
                await dog.save();

                var usedHouse;
                var usedRoom;

                if (casaType == "room") {
                    usedRoom = await Room.findOneAndUpdate({ user: req.userId, _id: roomId }, { '$set': { 'useRoomTime': dogTypeTime } }, { new: true });
                    await usedRoom.save();
                } else {
                    usedHouse = await House.findOneAndUpdate({ user: req.userId, _id: houseId }, { '$set': { 'useHouseTime': dogTypeTime } }, { new: true });
                    await usedHouse.save();
                }

                await transferFee(req.userId, boneFee);

                const usedAccount = await Account.findOneAndUpdate({ user: req.userId }, { '$inc': { 'bone': boneIncr } }, { new: true });
                await usedAccount.save();

                return res.send({ msg: 'OK', usedAccount, dog, usedBed, usedHouse, usedRoom });
            default:
                return res.send({ msg: 'Status não identificado' });
        }
    } catch (err) {
        return res.status(400).send({ msg: 'Erro no servidor ao gerenciar o pet.' });
    }
});

router.post('/buy', async (req, res) => {
    const buyDogReq = req.body;
    try {
        let buyDog;

        const buyDogDate = await BuyDog.findOne({ user: req.userId }).sort({ 'createdAt': -1 }).limit(1);

        if (buyDogDate !== null) {
            if (!buyDogDate.paid) {
                if ((new Date(buyDogDate.createdAt).getTime() + 1200000) > new Date().getTime()) { // ADICIONAR VARIAVEL PARA A DATA
                    if ((new Date(buyDogDate.createdAt).getTime() + 600000) > new Date().getTime()) { // ADICIONAR VARIAVEL PARA A DATA
                        buyDog = buyDogDate;
                        return res.send({ msg: 'OK', buyDog });
                    } else {
                        return res.status(400).send({ msg: 'Caso não tenha completado a última compra espere pelo menos 20 minutos para solicitar outra.' });
                    }
                }
            }
        }

        const account = await Account.findOne({ user: req.userId });
        if (buyDogReq.amount * gameSettings.dogPrice > account.bone)
            return res.status(400).send({ msg: 'Você não possui Bone o suficiente.' });

        const { transactionId } = await BuyDog.findOne({}).sort({ 'transactionId': -1 }).limit(1);
        const user = await User.findOne({ _id: req.userId });

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
        const _amount = buyDogReq.amount;

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
            'user': req.userId,
            'signature': sigMessage,
            'amount': _amount.toString(),
            'date': _date
        }

        buyDog = await BuyDog.create(buyDogObj);

        console.log(_recipient,
            _amount,
            _transactionId,
            _date,
            _contract, sigMessage, buyDogTransaction
        );

        return res.send({ msg: 'OK', buyDog });
    } catch (err) {
        return res.status(400).send({ msg: 'Erro do servidor.' });
    }
});

module.exports = app => app.use('/dogs', router);