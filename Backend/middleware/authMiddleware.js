import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"

const authMiddleware = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        if (!accessToken) return res.status(400).json({ success: false, message: "accessToken is not available" });

        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const user = await userModel.findById(decoded.id);
        if (!user) return res.status(400).json({ success: false, message: "invalid token" });

        req.user = user;
        next();
        
    } catch (error) {
        console.error("JWT error:", error.message);
        return res.status(401).json({ message: "Invalid or expired user token" });
    }
};

export default authMiddleware