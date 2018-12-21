const cron = require('node-cron')
let {Item} = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
cron.schedule("*/30 * * * *", function () {
    function findMonopolly () {
        Item.findAll({
            where: {
                item_name: 'Monopolly Cellymut',
                parent_id: {
                    [Op.ne]: -1,
                }
            }
        })
            .then((items)=> {
                let stocks = 0
                for(var i=0;i<items.length;i++) {
                    // console.log(items[i].dataValues)
                    stocks+=items[i].item_stocks
                }
                Item.update({
                    item_stocks: stocks
                }, {
                    where : {
                        item_name: 'Monopolly Cellymut',
                        parent_id: {
                            [Op.eq]: -1,
                        }
                    }
                })
                    .then(()=> {
                    })
                    .catch(err=> {
                        console.log(err)
                    })

            })
            .catch(err=> {
                console.log(err)
            })
    }
    findMonopolly()

    function findUlarTangg () {
        Item.findAll({
            where: {
                item_name: 'Ular Tangga Cellymut',
                parent_id: {
                    [Op.ne]: -1,
                }
            }
        })
            .then((items)=> {
                let stocks = 0
                for(var i=0;i<items.length;i++) {
                    // console.log(items[i].dataValues)
                    stocks+=items[i].item_stocks
                }
                Item.update({
                    item_stocks: stocks
                }, {
                    where : {
                        item_name: 'Ular Tangga Cellymut',
                        parent_id: {
                            [Op.eq]: -1,
                        }
                    }
                })
                    .then(()=> {
                    })
                    .catch(err=> {
                        console.log(err)
                    })

            })
            .catch(err=> {
                console.log(err)
            })
    }
    findUlarTangg()

})

module.exports = cron