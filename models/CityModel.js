const City = require('../schemas/city')
const Area = require('../schemas/area')

const getCityBySlug =  (slug) => {
    return new Promise((resolve, reject) => {
        City.findOne({ slug })
        .populate('area', '_id name slug code order')
        .select('_id name slug code area')
        .exec((err, data) => {
            if(err) {
                reject(null)
            }
            resolve(data);
        })
    })
    
}

module.exports = {
    getCityBySlug
}