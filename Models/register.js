import mongoose from "mongoose";
const registrochema = new mongoose.Schema({
    nombre: { type: String, },
    correo: { type: String, },
    contraseña: { type: String, },
    rol: { type: String, default: "usuario" },
    tiempoDeBloqueo: { type: Number, default: 0 },
    intentosFallidos: { type: Number, default: 0 }
})
export default mongoose.model("registro", registrochema)