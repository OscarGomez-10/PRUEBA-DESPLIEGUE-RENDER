import Usuario from "../Models/register.js"

const dash = async (req, res) => {
    const persona = req.persona
    res.json({ msg: persona })
}


const actualizarUsuario = async (req, res) => {
    try {
        const { nombre, correo, contraseña, persona } = req.body;
        const CorreoBuscar = persona[0].correo
        console.log(CorreoBuscar);
        if (CorreoBuscar != correo) {
            const CorreoUso = await Usuario.findOne({ correo: correo })
            if (CorreoUso) {
                console.log(CorreoUso);
                return res.status(400).json({ error: 'El nuevo correo ya está en uso' });
            }
        }
        await Usuario.findOneAndUpdate({ correo: CorreoBuscar }, { nombre: nombre, correo: correo, contraseña: contraseña });
        const personaN = await Usuario.findOne({ correo: correo })
        res.json({ msg: "Datos actualizados correctamente", usuario: personaN });

    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar los datos" });
    }
};


export { dash, actualizarUsuario }