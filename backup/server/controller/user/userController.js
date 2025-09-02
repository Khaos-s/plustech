// controller/user/userController.js
export const getUserData = (req, res) => {
    // Assuming you have user info in req.userId and req.userRole
    res.json({
        success: true,
        user: {
            id: req.userId,
            role: req.userRole,
        }
    });
};
