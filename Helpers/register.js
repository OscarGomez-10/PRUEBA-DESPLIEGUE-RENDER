import registro from "../Models/register.js"


const ValidateUserExists = async (Email) => {
    const User = await registro.findOne({ correo: Email })
    if (User) {
        throw new Error("EL CORREO YA ESTA REGISTRADO")
    }
}
export { ValidateUserExists }