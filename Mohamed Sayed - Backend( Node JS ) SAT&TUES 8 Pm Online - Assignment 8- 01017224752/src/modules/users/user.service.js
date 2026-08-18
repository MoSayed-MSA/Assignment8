import userModel from "../../db/models/user.model.js"
import { encrypt } from "../../utails/encryption.js"
import { hashPassword } from "../../utails/hash.js"
import { generateToken } from "../../utails/jwt.js"

export const signUp = async (req, res, next) => {
    const { email, password, phone } = req.body

    const checkEmailExist = await userModel.findOne({ email })
    if (checkEmailExist) {
        throw new Error('Email already exists.', { cause: 409 })
    }

    const hashedPassword = await hashPassword(password)
    await userModel.create({ ...req.body, password: hashedPassword, phone: encrypt(phone) })

    res.status(201).json({ message: 'User added successfully.' })
}

export const logIn = async (req, res, next) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    if (!user) {
        throw new Error('Invalid email or password', { cause: 400 })
    }

    const isMatch = await hashPassword(password, user.password)
    if (!isMatch) {
        throw new Error('Invalid email or password', { cause: 400 })
    }

    const token = generateToken({
        payload: { id: user._id, email: user.email },
        secretKey: 'msa123',
        options: { expiresIn: '1h' }
    })

    if (!token) {
        throw new Error('Token generation failed', { cause: 500 })
    }

    res.status(200).json({ message: 'Login successful', token })
}

export const updateUser = async (req, res, next) => {
    const id = req.user._id
    const { name, email, age, phone } = req.body

    if (email) {
        const emailExist = await userModel.findOne({ email, _id: { $ne: id } })
        if (emailExist) {
            throw new Error('Email already exists.', { cause: 409 })
        }
    }

    const updatedUser = await userModel.findByIdAndUpdate(
        id,
        { name, email, age, phone: phone ? encrypt(phone) : undefined },
        { returnDocument: 'after' }
    )

    if (!updatedUser) {
        throw new Error('User not found', { cause: 404 })
    }

    res.status(200).json({ message: 'User updated', user: updatedUser })
}

export const deleteUser = async (req, res, next) => {
    const id = req.user._id

    const deletedUser = await userModel.findByIdAndDelete(id)

    if (!deletedUser) {
        throw new Error('User not found', { cause: 404 })
    }

    res.status(200).json({ message: 'User deleted' })
}

export const getUserData = async (req, res, next) => {
    const user = await userModel.findById(req.user._id)
    if (!user) {
        throw new Error('User not found', { cause: 404 })
    }

    res.status(200).json(user)
}