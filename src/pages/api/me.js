import jwt from 'jsonwebtoken'
import {checkTokenVersion, getUserJSON} from "../../../utils/Authenticate";
import dbConnect from "../../../utils/dbConnect";

export default async (req, res) => {
    await dbConnect()

    const {
        method,
        query: { userId },
        headers: { cookie }
    } = req

    if (method === 'POST') {
        try {
            const {sub, v} = jwt.verify(cookie, process.env.TOKEN_SECRET)

            const {user, valid} = await checkTokenVersion(sub, v)

            if (!valid) throw new Error('token is valid')


            res.status(200).json({success: true, me: getUserJSON(user)})
        } catch (e) {
            res.status(401).json({success: false, message: 'Not Authenticate'})
            res.end()
        }
    } else {
        res.status(404)
        res.end()
    }

}
