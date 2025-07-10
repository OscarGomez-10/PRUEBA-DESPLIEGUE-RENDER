import Registros from "../Models/register.js"

const ValidatePerson = async (email, req) => {
    const persona = await Registros.findOne({ correo: email })
    if (!persona) {
        throw new Error("EL CORREO INGRESADO NO SE ENCUENTRA REGISTRADO")
    }
    req.req.persona = persona
}

export { ValidatePerson }