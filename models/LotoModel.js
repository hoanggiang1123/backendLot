const Lottery = require('../schemas/lottery');

const checkLotteryExist = (check) => {
    return new Promise((resolve, reject) => {
        Lottery.findOne({ check }).exec((err, data) => {
            if (!data) {
                resolve(false);
            } 
            resolve(true);

            if (err) {

                reject('error occur');
            }
        })
    })
}

const saveLoto = (data) => {
    return new Promise ((resolve, reject) => {
        const loto = new Lottery(data);
        loto.save ((err, newloto) => {
            if (err) {
                reject(err)
            }
            resolve('ok')
        })
    })
}

module.exports = {
    checkLotteryExist,
    saveLoto
}