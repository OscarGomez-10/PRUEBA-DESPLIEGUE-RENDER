import jwt from 'jsonwebtoken';
import Registro from '../Models/register.js'


const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: "25m"
        }, (err, token) => {

            if (err) {
                reject("No se pudo generar el token")
            } else {
                resolve(token)
            }
        })
    })
}

const validarJWT = async (req, res, next) => {
    const { token } = req.headers
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        let usuario = await Registro.find({ correo: uid })
        if (!usuario) {
            return res.status(401).json({
                msg: "Token no válido "
            })
        }
        req.persona = usuario
        next();
    }
    catch (error) {
        res.status(401).json({
            msg: "Token no valido2"
        })
    }
}





export { generarJWT, validarJWT } 
