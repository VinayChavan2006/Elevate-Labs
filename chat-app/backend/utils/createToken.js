import jwt from 'jsonwebtoken'

export const createToken = (res, userId) => {
    try {
        const payload = {
            userId
        }
        // create a jwt token
        const token = jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn: "30d"
        })
        res.cookie("token",token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        return token;
    } catch (error) {
        console.error(`Error in createToken: ${error}`)
    }
}