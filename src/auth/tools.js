import jwt from "jsonwebtoken"

export const generateJWTToken = (payload) => 
    new Promise((resolve, reject) => 
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "24h"}, (err, token) => {
            if (err) reject(err)
            else resolve(token)
})
)


export const JWTAuth = async (user) => {
    // 1. given the user generates token
    const accessToken = await generateJWTToken({_id: user._id})
    return accessToken
}


export const verifyJWT = (token) => 
    new Promise((resolve, reject) => 
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) reject(err)
        else resolve(decodedToken)
    })    
)