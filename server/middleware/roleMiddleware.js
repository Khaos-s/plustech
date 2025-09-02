// middleware/roleMiddleware.js
const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.userRole !== role) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        next();
    };
};

export default authorizeRole;
