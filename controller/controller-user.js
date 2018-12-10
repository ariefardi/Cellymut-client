const moment = require('moment')
const jwt = require('jsonwebtoken')
const {secret_key} = require('../config/config.json')
const {User} = require('../models')
const { createPassword} = require('../crypto')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
class Controller {
    static getUsers (req, res) {
        User.findAll({order: [['id', 'ASC']]})
            .then((users)=> {
                res.json({
                    users,
                    message: "Get All Users"
                })
            })
            .catch(err=> {
                res.json({
                    message: "Error Get All Users",
                    err
                })
            })
    }
    static getOneUsers (req, res) {
        let id = req.params.id
        console.log(id,'id')
        User.findById(id)
            .then((user)=> {
                res.json({
                    message: "Get One User",
                    user
                })
            })
            .catch(err=> {
                res.json({
                    message: "Error Get One User",
                    err
                })
            })
    }

    static updateUser (req, res) {
        let decoded = jwt.verify(req.headers.token, secret_key)
        let id = req.params.id
        let email = decoded.email
        let password = req.body.password
        let newPass = req.body.newPass
        let address = req.body.address
        let type_home = req.body.type_home
        let country = req.body.country
        let provinsi = req.body.provinsi
        let postal_code = req.body.postal_code
        let updated_at = moment().unix()
        console.log(req.body)
        if (!password) {
            console.log(req.body.city, 'ini city')
            User.update({
                email,
                address,
                type_home,
                city: req.body.city,
                country,
                provinsi,
                postal_code,
                updated_at
            }, {
                where: {
                    id: {
                        [Op.eq] : id,
                    }
                }
            })
                .then(()=> {
                    res.json({
                        message: "Berhasil Update"
                    })
                })
                .catch(err=> {
                    res.json({
                        message: "Gagal Update",
                        err
                    })
                })
        }
        else {
            User.findOne({
                where: {
                    email
                }
            })
                .then((user)=> {
                    let decipherHash = user.password.split('.')
                    let salt = decipherHash[1]
                    let isPassword = createPassword(password, salt)
                    let passUser = user.password
                    if (isPassword===passUser)  {
                        let newPassword = createPassword(newPass, salt)
                        User.update({
                            email,
                            address,
                            type_home,
                            city: req.body.city,
                            country,
                            provinsi,
                            postal_code,
                            updated_at,
                            password: newPassword
                        }, {
                            where: {
                                id: {
                                    [Op.eq] : id,
                                }
                            }
                        })
                            .then(()=> {
                                res.json({
                                    message: "Berhasil Update Ganti Password"
                                })
                            })
                            .catch(err=> {
                                res.json({
                                    message: "Gagal Update Password",
                                    err
                                })
                            })

                    }
                    else {
                        res.json({
                            message: "Password salah"
                        })
                    }
                })
        }

    }
}

module.exports = Controller