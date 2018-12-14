const {Transaction, Item, User} = require('../models')
const moment = require('moment')
const {secret_key} = require('../config/config')
const { createRandomId } = require('../crypto')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class Controller {

    static getTransactions (req, res) {
        Transaction.findAll({
            include : {
                model: User,
                include: {
                    model: Item
                }
            },
        })
            .then((trans)=> {
                res.json({
                    msg: "get all transactions",
                    trans
                })
            })
            .catch(err=> {
                console.log(err)
                res.json({
                    msg: "error getting all transactions",
                    err
                })
            })
    }

    static  getOneTransactions (req, res) {
        const id = req.params.id
        Transaction.findById(id)
            .then(tran=> {
                res.json({
                    msg: 'Get one transaction',
                    tran
                })
            })
            .catch(err=> {
                res.json({
                    msg: "error getting one transcations",
                    err
                })
            })
    }

    static getUserTransactions (req, res) {
        let decoded = jwt.verify(req.headers.token, secret_key)
        let UserId = decoded.id
        Transaction.findAll({
            include: {
                model: Item
            },
            where: {
                UserId: {
                    [Op.eq] : UserId
                }
            }
        })
            .then((trans)=> {
                res.json({
                    msg: "get transaksi berdasarkan user id!",
                    trans
                })
            })
            .catch(err=> {
                res.json({
                    err,
                    msg: "error mendapatkan transaksi berdasarkan user id!"
                })
            })
    }



    static buyTransaction (req, res) {
        let decoded = jwt.verify(req.headers.token, secret_key)
        let UserId = decoded.id
        let ItemId = req.params.item_id
        let id = createRandomId()
        let quantity = Number(req.body.quantity)
        let color = req.body.color
        let price = Number(req.body.price)
        let total = price*quantity
        let createdAt = moment().unix()
        let updatedAt = moment().unix()

        Transaction.create({
            id,
            UserId,
            ItemId,
            quantity,
            color,
            total,
            createdAt,
            updatedAt
        })
            .then(()=> {
                res.json({
                    msg: "berhasil menambahkan transaksi baru!"
                })
            })
            .catch(err=> {
                res.json({
                    msg: "error menambahkan transaksi",
                    err
                })
            })
    }



    static cancelTransaction (req, res) {
        let id = req.params.trans_id
        Transaction.destroy({
            where: {
                id: {
                    [Op.eq] : id
                }
            }
        })
            .then((data)=> {
                if (data) {
                    res.json({
                        data,
                        msg: "berhasil cance transaksi dengan id "+id
                    })
                }
                else {
                    res.json({
                        msg: "Tidak ada data yang terhapus"
                    })
                }
            })
            .catch((err)=> {
                res.json({
                    msg: 'gagal menghapus transaksi',
                    err
                })
            })
    }

    static changeStatusTransactions (req, res) {

    }
}

module.exports = Controller