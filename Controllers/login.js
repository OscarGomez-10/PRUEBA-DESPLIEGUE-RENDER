
import { generarJWT } from "../Middlewares/validar_jwt.js"

const login = async (req, res) => {
    const { password } = req.body;
    const persona = req.persona;

    // VALIDAR SI EL USUARIO ESTA BLOQUEADO
    if (persona.tiempoDeBloqueo && persona.tiempoDeBloqueo > Date.now()) {
        const tiempo = persona.tiempoDeBloqueo - Date.now();
        return res.json({
            estado: 0,
            motivo: "VARIOS INTENTOS FALLIDOS",
            tiempo: tiempo
        });
    }

    // VALIDAR LA CONTRASEÑA
    if (password !== persona.contraseña) {
        persona.intentosFallidos = (persona.intentosFallidos || 0) + 1;

        // SI INTENTOS =5 SE GENERA EL TIEMPO DE BLOQUEADO
        if (persona.intentosFallidos == 5) {
            persona.tiempoDeBloqueo = Date.now() + 200000;
            persona.intentosFallidos = 0;
            await persona.save();

            const tiempo = persona.tiempoDeBloqueo - Date.now();
            return res.json({ estado: 0, motivo: "Demasiados intentos fallidos. Espera para volver a intentar.", tiempo: tiempo });
        }

        await persona.save();
        return res.json({ msg: 0 });
    }

    persona.intentosFallidos = 0;
    persona.tiempoDeBloqueo = 0;
    await persona.save();

    let ruta;
    if (persona.rol === "admin") {
        ruta = "../Dashboard/dashboardAdmin.html"; // RUTA DEL DASHBOARD PARA EL ROL ADMIN
    } else {
        ruta = "../Dashboard/dashboardUsuario.html";// RUTA DEL DASHBOARD PARA EL ROL USUARIO
    }

    const token = await generarJWT(persona.correo); // GENERAR EL TOKEN


    return res.json({ token, redirect: ruta });
};


export { login }
