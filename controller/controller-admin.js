const {Admin}  = require('../models')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const { createRandomSalt, createPassword} = require('../crypto')

class Controller {
    static getAdmins (req, res) {
        Admin.findAll()
            .then((admins)=> {
                res.json({
                    msg : "get all admins",
                    admins
                })
            })
            .catch(err=> {
                res.json({
                    msg : "error get add admins",
                    err
                })
            })
    }
    static getOneAdmin (req, res) {
        let id = req.params.id
        Admin.findById(id)
            .then((admin)=> {
                res.json({
                    msg: "get one admin",
                    admin
                })
            })
            .catch(err=> {
                res.json({
                    msg: "error get one admin",
                    admin
                })
            })
    }
    static addAdmin (req, res) {
        let username = req.body.username
        let salt = createRandomSalt()
        let password = createPassword(req.body.password,salt)
        let created_at = moment().unix()
        let updated_at = moment().unix()
        User.findOrCreate({
            where : {
                username: username
            },
            defaults: {
                password,
                created_at,
                updated_at
            }
        })
            .spread((admin , created) => {
                console.log(created)
                if (created) {
                    res.json({
                        message: "Berhasil register user baru",
                        admin
                    })
                }
                else {
                    res.json({
                        message: "Username telah digunakan",
                    })
                }
            })
    }
    static updateAdmin

    static login (req, res) {
        let username = req.body.username
        let password = req.body.password
        User.findOne({
            where : {
                username
            }
        })
            .then((user)=> {
                if (user) {
                    let decipherHash = user.password.split('.')
                    let salt = decipherHash[1]
                    let isPassword = createPassword(password, salt)
                    let passUser = user.password
                    if (isPassword===passUser )  {
                        const token = jwt.sign({
                            id: user.id,
                            username: user.username,
                        }, secret_key)
                        res.json({
                            message: "Login Berhasil!!",
                            token
                        })
                    }
                    else {
                        res.json({
                            message: "Username/Password salah"
                        })
                    }
                }
                else {
                    res.json({
                        message: "Username/Password salah"
                    })
                }
            })
            .catch(err=> {
                res.json({
                    message: "Error Login",
                    err
                })
            })
    }
}

module.exports = Controller