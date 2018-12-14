
const {Cart, User, Item} = require('../models')
const moment = require('moment')

const jwt = require('jsonwebtoken')
let {secret_key} = require('../config/config.json')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


class Controller {

    static getCarts (req, res) {
        Cart.findAll()
            .then(carts=> {
                res.json({
                    carts
                })
            })
            .catch(err=> {
                res.json({
                    err
                })
            })
    }

    static getCartsByUserId (req, res) {
        let decoded = jwt.verify(req.headers.token, secret_key)
        let UserId = decoded.id
        Cart.findAll({
            include: {
                model: Item,
                include: {
                    model: User
                }
            }
        },{
            where: {
                UserId: {
                    [Op.eq] : UserId
                }
            }
        })
            .then((carts)=> {
                res.json({
                    msg: "Get all carts by user id",
                    carts
                })
            })
            .catch(err=> {
                res.json({
                    err
                })
            })
    }

    static getOneCart (req, res) {
        let id = req.params.cart_id
        Cart.findOne({
            where : {
                id: {
                    [Op.eq]: id
                }
            }
        })
            .then((cart)=> {
                res.json({
                    msg: 'Get one cart',
                    cart
                })
            })
            .catch(err=> {
                res.json({
                    err
                })
            })
    }

    static addCart (req, res) {
        let decoded = jwt.verify(req.headers.token, secret_key)
        let UserId = decoded.id
        console.log(decoded)
        let ItemId = req.params.item_id
        let name = req.body.name
        let createdAt = moment().unix()
        let updatedAt = moment().unix()
        Cart.findOrCreate({
            where: {
                UserId: {
                    [Op.eq]: UserId
                },
                ItemId: {
                    [Op.eq]: ItemId
                }
            },
            defaults: {
                UserId,
                ItemId,
                quantity: 1,
                createdAt,
                updatedAt,
                name
            }
        })
            .spread((cart, created) => {
                if (created) {
                    res.json({
                        msg: "Berhasil buat Cart baru"
                    })
                }
                else {
                    cart.quantity+=1
                    Cart.update({
                        quantity: cart.quantity
                    }, {
                        where: {
                            id: {
                                [Op.eq]: cart.id
                            }
                        }
                    })
                        .then((newCart)=> {
                            res.json({
                                msg: "Udah ada cart",
                                cart,
                                newCart
                            })
                        })
                        .catch(err=> {
                            console.log(err)
                            res.json({
                                err
                            })
                        })
                }
            })
    }

    static addQuantity (req, res) {
        let decoded = jwt.verify(req.headers.token, secret_key)
        // let UserId = decoded.id
        // let ItemId = req.body.ItemId
        let updatedAt = moment().unix()
        let id = req.params.cart_id
        Cart.findOne({
            where: {
                id: {
                    [Op.eq]: id
                },
            }
        })
            .then((cart)=> {
                cart.quantity+=1
                Cart.update({
                    quantity: cart.quantity,
                    updatedAt
                },{
                    where: {
                        id: {
                            [Op.eq]: id
                        }
                    }
                })
                    .then(()=> {
                        res.json({
                            msg: "Berhasil menambahkan quantity",
                            cart
                        })
                    })
                    .catch(err=> {
                        console.log(err)
                        res.json({
                            err
                        })
                    })
            })
            .catch(err=> {
                res.json({
                    err
                })
            })
    }

    static deleteCart (req, res) {
        let id = req.params.cart_id
        Cart.destroy({
            where: {
                id: {
                    [Op.eq]: id
                }
            }
        })
            .then(()=> {
                res.json({
                    msg: "berhasil menghapus cart!"
                })
            })
            .catch(err=> {
                console.log(err)
                res.json({
                    err
                })
            })
    }
}

module.exports = Controller