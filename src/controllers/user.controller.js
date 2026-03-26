import AsyncHandler from 'express-async-handler';

const registerUser = AsyncHandler(async (req, res) => {
    res.status(200).json({
        message: "User registered successfully"
    })
})

const loginUser = AsyncHandler(async (req, res) => {
    res.status(200).json({
        message: "User logged in successfully"
    })
})

export {
    registerUser,
    loginUser
}