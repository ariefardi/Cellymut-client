const moment = require('moment')
const jwt = require('jsonwebtoken')
const {User} = require('../models')
const { createRandomSalt, createPassword} = require('../crypto')
let {secret_key} = require('../config/config.json')
class Controller {
    static register (req, res) {
        let email = req.body.email
        let first_name = req.body.first_name
        let last_name = req.body.last_name
        let phone_number = req.body.phone_number

        let salt = createRandomSalt()
        let password = createPassword(req.body.password,salt)
        let created_at = moment().unix()
        let updated_at = moment().unix()
        User.findOrCreate({
            where : {
                email: email
            },
            defaults: {
                first_name,
                last_name,
                password,
                created_at,
                updated_at,
                phone_number
            }
        })
            .spread((user , created) => {
                console.log(created)
                if (created) {
                    res.json({
                        message: "Berhasil register user baru",
                        user
                    })
                }
                else {
                    res.json({
                        message: "Email telah digunakan",
                    })
                }
            })

    }
    static login (req, res) {
        let email = req.body.email
        let password = req.body.password
        User.findOne({
            where : {
                email
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
                            email: user.email,
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