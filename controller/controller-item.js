const {Item} = require('../models')
const moment = require('moment')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
        let item_image = req.body.item_image
        let created_at = moment().unix()
        let updated_at = moment().unix()
        Item.create({
            item_name,
            item_price,
            item_stocks,
            item_image,
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

    static updateItem (req, res) {
        let id = req.params.id
        let item_name = req.body.item_name
        let item_price = req.body.item_price
        let item_stocks = req.body.item_stocks
        let item_image = req.body.item_image
        let updated_at = moment().unix()
        Item.update({
            item_name,
            item_price,
            item_stocks,
            item_image,
            updated_at
        }, {
            where: {
                id: {
                    [Op.eq] : id
                }
            }
        })
            .then(()=> {
                res.json({
                    msg: "Berhasil update item "
                })
            })
            .catch((err)=> {
                res.json({
                    msg: "Gagal update item",
                    err
                })
            })
    }

    static changeStatusItem(req, res) {
        let id = req.params.id
        let status = req.body.status
        Item.update({
            status
        },{
            where: {
                id: {
                    [Op.eq] : id
                }
            }
        })
            .then(()=> {
                res.json({
                    msg: "Berhasil merubah status menjadi " + status
                })
            })
            .catch((err)=> {
                res.json({
                    msg: "gagal merubah status",
                    err
                })
            })
    }
}

module.exports = Controller