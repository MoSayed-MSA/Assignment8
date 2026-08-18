import jwt from "jsonwebtoken"

//generate token
export const generateToken = ({ payload, secretKey, options = {} } = {}) => {
    const token = jwt.sign(payload, secretKey, options)
    return token
}


//verify token
export const verifyToken = ({ token, secretKey, options = {}} = {}) => {
    try {
        const decoded = jwt.verify(token, secretKey, options)
        return decoded
    } catch (error) {
        throw new Error('Invalid token', { cause: 401 })
    }
}


//decode token
export const decodeToken = ({ token } = {}) => {
    try {
        const decoded = jwt.decode(token)
        return decoded
    } catch (error) {
        throw new Error('Invalid token', { cause: 401 })
    }
}

