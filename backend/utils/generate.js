import jwt from 'jsonwebtoken';

export function generateTokens(email,accessTokenExpiry,refreshTokenExpiry){
    const accessToken = jwt.sign({email},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: accessTokenExpiry,
    });
    const refreshToken = jwt.sign({email},process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: refreshTokenExpiry,
    });
    return {accessToken,refreshToken};
}

export function validateToken(req,res,next){
    let token=req.header("Authorization")?.split(" ")[1];
    if(!token){
        token =req.cookies.accessToken;
       if(!token){
        return res.status(401).json(
            {message :"Access Denied"}
        );
       }
    }
    try{
        const decoded= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.user=decoded;
        next();

    }

    catch(error){
 return res.status(400).json({message :"Invalid Tokens"});
    }

}