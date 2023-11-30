import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import Blacklist from "../models/Blacklist.js";
import User from "../models/Usermodel.js";
export async function Verify(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.sendStatus(401);
    }

    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
        return res.sendStatus(401);
    }

    const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });

    if (checkIfBlacklisted) {
        return res
            .status(401)
            .json({ message: "This session has expired. Please login" });
    }

    jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res
                .status(401)
                .json({ message: "This session has expired. Please login" });
        }
        console.log(decoded)
        const { _id } = decoded;
        console.log(_id)
        const user = await User.findById(_id);

        if (!user) {
            return res
                .status(401)
                .json({ message: "User not found. Please login" });
        }

        const { password, ...data } = user._doc;
        req.user = data;
        req.token = accessToken; // Add the token to the request object for later use
        next();
    });
}
