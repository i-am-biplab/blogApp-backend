const jwt = require("jsonwebtoken");
const User = require("../models/user");


// Middleware to verify JWT token

// for getting token from request header
const verifyToken = (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    console.log(authorization);

    try {
        if(authorization && authorization.startsWith('Bearer')) {
            token = authorization.split(' ')[1];
            if (!token) {
                return res.status(403).json({"isvalid": false, error: "No Token Found" });
            }

            jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
                if (err) {
                    return res.status(403).json({"isvalid": false, error: "Token Verification Error" });
                }
        
                const uid = decoded.uid;

                const user = await User.findOne({
                    attributes: ["uid"],
                    where: { uid: uid }
                });

                if (user.length === 0) {
                    return res.status(500).json({ error: "User not found in the database" });
                }

                req.uid = user.uid;
                req.isvalid = true;
                req.message = "Authorized User";
                next();
            });
        }
        else {
            return res.status(403).json({"isvalid": false, error: "No Bearer Found in Header" });
        }
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = verifyToken;