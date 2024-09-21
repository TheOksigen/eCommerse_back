const { z } = require("zod");

const validateMiddleware = (schema) => {
    return (req, res, next) => {
        try {
            next();
            
            // schema.parse(req.body);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
};

module.exports = validateMiddleware;