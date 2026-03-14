const jwt = require('jsonwebtoken');

exports.auth = async(req, res, next) => {

    try {

        let token = req.header('Authorization')?.replace("Bearer ", "") || req.cookies.token;
        console.log("token", token);

        if(!token) {
            return res.status(401).json({
                success:false,
                message: 'Token missing!'
            })
        }

        // verify token
        try {

            let decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("token decode", decode);

            req.user = decode;

        } catch(err) {
            console.log(err);
            return res.status(401).json({
                success:false,
                message: 'Error occured while token decoding!'
            })

        }

        next();

    } catch(err) {
        console.log("error occured while auth", err);
        res.json({
            success:false,
            message: "error occured"
        })
    }
}