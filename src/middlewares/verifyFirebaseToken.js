const { adminAuth } = require("../config/firebaseAdmin");

const verifyFirebaseToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token) {
         return res.status(401).json({
            status: false,
            message: "Unauthorized Access!"
        });
    }
    
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);

        req.decodedEmail = decodedToken.email;
        req.decodedUid = decodedToken.uid;

        next();
    } catch (error) {
        console.log("Error verifying authorization: ", error);

        res.status(401).json({
            status: false,
            message: "Unauthorized Access. Please, try again.",
        });
    }
}

module.exports = verifyFirebaseToken;