import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// Hash password function
const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

// Compare password function (useful later for Login)
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export { hashPassword, comparePassword };