import Blacklist from '../models/Blacklist.js';
export async function Logout(req, res) {
    try{
    const accessToken = req.token;

    // Check if the token is already blacklisted
    const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });

    // If not blacklisted, add it to the blacklist
    if (!checkIfBlacklisted) {
        const blacklistEntry = new Blacklist({ token: accessToken });
        await blacklistEntry.save();
    }

    res.status(200).json({ message: "Logout successful" });
}catch(err){
    console.error(err);
    res.status(500).json({ error: "Server error" });
}
}