import {sign, verify} from 'jsonwebtoken'
import User from "../../models/User";

const { TOKEN_SECRET } = process.env


export const verifyAccessToken = token => {
    return verify(token, TOKEN_SECRET,{ignoreExpiration: true})
}

export const verifyRefreshToken = token => {
    return verify(token, TOKEN_SECRET)
}

export const getUserJSON = user => {
    const userJSON = {
        id: user?._id,
        username: user?.username,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        image: user?.image,
    }

    return userJSON
}

export const checkTokenVersion = async (id, tokenVersion) => {
    const user = await User.findById(id)

    if (!user) return false


    return {
        valid: tokenVersion == user.tokenVersion,
        user
    }

}

