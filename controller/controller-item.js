const {Item} = require('../models')
const moment = require('moment')


class Controller {
    static getItems (req, res) {
        Item.findAll()
            .then((items)=> {
                res.json({
                    message: 'Get All Items',
                    items
                })
            })
    }
    static getOneItem (req, res) {
        let id = req.params.id
        Item.findById(id)
            .then((item)=> {
                res.json({
                    message: "get one item",
                    item
                })
            })
            .catch(err=> {
                res.json({
                    message: "error get one item",
                    err
                })
            })
    }

    static addItem (req, res) {
        let item_name = req.body.item_name
        let item_price = req.body.item_price
        let item_stocks = req.body.item_stocks
        let created_at = moment().unix()
        let updated_at = moment().unix()
        Item.create({
            item_name,
            item_price,
            item_stocks,
            created_at,
            updated_at
        })
            .then(()=> {
                res.json({
                    message: "berhasil menambahkan item baru",
                })
            })
            .catch(err=> {
                res.json({
                    message: "gagal menambahkan item baru",
                    err
                })
            })
    }
}

module.exports = Controller