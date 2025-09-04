// controller/user/userController.js
import { db } from "../../config/firebase/firebaseAdmin.js";

export const getUserData = async (req, res) => {
    try {
        const userDoc = await db.collection("users").doc(req.userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userData = userDoc.data();

        res.json({
            success: true,
            user: {
                id: userDoc.id,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role,
                createdAt: userData.createdAt,
                updatedAt: userData.updatedAt,
                // Add any other profile fields you need
                profile: userData
            }
        });
    } catch (err) {
        console.error("❌ Error fetching user data:", err);
        res.status(500).json({ success: false, message: "Failed to fetch user data" });
    }
};