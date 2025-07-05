const jwt = require("jsonwebtoken");

const testUsers = [
    {
        id: 1,
        email: "doctor@test.com",
        name: "Dr. Juan Pérez",
        role: "doctor"
    },
    {
        id: 2,
        email: "patient@test.com",
        name: "María González",
        role: "patient"
    },
    {
        id: 3,
        email: "admin@test.com",
        name: "Admin Sistema",
        role: "admin"
    }
];

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Token de acceso requerido"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token no proporcionado"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = testUsers.find(u => u.id === decoded.id);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error en verificación de token:", error);
        
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expirado"
            });
        }
        
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Token inválido"
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor"
        });
    }
};

module.exports = {
    verifyToken
};
