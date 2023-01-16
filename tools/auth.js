const jwt = require('jsonwebtoken');
const rt=require('../routes/auth/rt.model');
const uuid = require("uuid");

const createToken=(user) => {
    return jwt.sign({
        id: user._id,
    }, "123465654323", {expiresIn: "1h"});
}

const checkJWTMiddleware=async(req, res, next)=>{
    try {
        let token = "";
        let refreshToken = "";

        if (req.cookies?.token) {
            token = req.cookies.token;
            refreshToken = req.cookies.refreshToken;
        } else if (req.headers?.authorization) {
            token = req.headers.authorization;
            refreshToken = req.headers["refresh-token"];
        } else {
            throw {
                status: 401,
                error: new Error('No token provided')
            }
        }
        const rfrTkn=await rt.findOne({rt:refreshToken}).populate('user');
        if(!rfrTkn){
            throw {
                status: 401,
                error: new Error('Unauthorized!')
            }
        }
        jwt.verify(token,"123465654323",async function(err,decode){
            try {
                if(err){
                    if(err.name!=='TokenExpiredError'){
                        throw{
                            status:403,
                            error:new Error('Token is not valid!')
                        }
                    }
                    const refreshToken = await new rt({
                        user: rfrTkn.user._id,
                        token: createToken(rfrTkn.user),
                        rt: uuid.v4()
                    }).save();
                    res.cookie('token',refreshToken.token);
                    res.cookie('refreshToken',refreshToken.rt);
                    next()
                }else{
                    res.cookie('id',decode.id)
                    next()
                }
            } catch (error) {
                next(error)
            }
        });
    } catch (error) {
        next(error)
    }
}

module.exports = {createToken,checkJWTMiddleware}