import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { generateTokens,validateToken } from "../utils/generate.js";
const prisma = new PrismaClient();

 const register = async (req, res) => {
    try{
        const{  name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).send({
                message: "Please fill in all fields",
            });
        }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user= await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    })
    res.status(200).send({
        message: "User registered successfully",
    });
    } catch (error) {
        console.log(error);
    }
};

const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        if(!email ||!password){
            return res.status(400).send({
                message: "Please fill in all fields",
            });
        }
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
             select:{
                  
                    name: true,
                    email: true,
                    password: true
                    
             }
        })
        if(!user){
           return res.status(400).send({
                message: "User not found",
            });
        }
        const passwordMatch= await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            return res.status(400).send({
                message: "Invalid credentials",
            });
        }
        const{accessToken, refreshToken} = generateTokens(
          
            user.email,"5d","10d"
        );
        const putToken = await prisma.user.update({
            where: {
                email,
            },
            data: {
               hashedToken: refreshToken,
            },
        })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
        });
        res.status(200).send({
            message: "User logged in successfully",
            data:{
                name: user.name,
                email: user.email
               
            },
            accessToken,refreshToken,
        });
    } catch (error) {
        console.log(error);
    }
};

const logout= async(req,res)=>{
    try{
        const {refreshToken}=req.body;
     
        let refreshToken_old=req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];

        if(!refreshToken && !refreshToken_old){
            return res
            .status(401)
            .json({message:"NO token "});
        }
        if(!refreshToken_old){
            refreshToken_old=refreshToken;
        }
        const decodedToken=jwt.verify(refreshToken_old,process.env.REFRESH_TOKEN_SECRET);
        

        const user= await prisma.user.findUnique(
            {
                where:{
                    email: decodedToken.email,
                }
            }
        );
        
    
        if(!user){
            return res
            .status(403)
            .json({message :"User not Found"});
        }
        await prisma.user.update({
          where :{
            email:decodedToken.email
          },
           data:{ hashedToken :null}
    });
   
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });


  
  

        return res.status(200).json({
            message: "Logged out successfully",
        });
        
    }
    catch(error){
        console.log(error.message);
        return res.status(403).json({ message: "Invalid refresh token." });
    }
}


const refreshAccessToken = async (req, res) => {
    try {
      // Get refresh token from cookie or authorization header
      const refreshToken = req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];
      
      if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
      }
      
      // Verify the refresh token
      const decoded = validateToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      if (!decoded) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      
      // Check if user exists and token matches
      const user = await prisma.user.findUnique({
        where: {
          email: decoded.email,
        },
        select: {
          email: true,
          hashedToken: true
        }
      });
      
      if (!user || user.hashedToken !== refreshToken) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      
      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(
        user.email, "5d", "10d"
      );
      
      // Update user with new refresh token
      await prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          hashedToken: newRefreshToken,
        },
      });
      
      // Set new cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
      });
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "strict",
      });
      
      return res.status(200).json({
        message: "Tokens refreshed successfully",
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: "Invalid refresh token" });
    }
  };

export { register, login ,logout,refreshAccessToken};