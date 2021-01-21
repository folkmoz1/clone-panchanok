import dbConnect from "../../../../utils/dbConnect";
import bcrypt from 'bcrypt'
import Cookies from 'cookies'
import User from "../../../../models/User";
import { getUserJSON } from "../../../../utils/Authenticate";
import jwt from 'jsonwebtoken'


export default async (req, res) => {
    const { method } = req
    await dbConnect()

    const cookie = new Cookies(req, res)


    if (method === 'POST') {
        let errors = {}

        const { userOrEmail, password } = req.body

        try {
            if (userOrEmail.trim() === '')
                errors.userOrEmail = 'username or email must not be empty'

            if (password === '')
                errors.password = 'password must not be empty'

            if (Object.keys(errors) > 0) {
                throw new Error(errors)
            }

            const user = await User.findOne({
                '$or': [{username: userOrEmail}, {email: userOrEmail}]
            })

            if (!user) {
                errors.userOrEmail = 'user not found'
                throw new Error(errors)
            }

            const correctPassword = await bcrypt.compare(password, user.password)

            if (!correctPassword) {
                errors.password = 'password is incorrect'
                throw new Error(errors)
            }

            const payload = { sub: user?._id, username: user?.username, v: user?.tokenVersion }

            const token = jwt.sign(payload, process.env.TOKEN_SECRET,{ expiresIn: 60 * 60})

            cookie.set('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                path: '/'
            })

            res.status(200).json({ success: true, message: token })
        } catch (err) {
            res.status(200).send({success: false, errors})
        }
    }
}
