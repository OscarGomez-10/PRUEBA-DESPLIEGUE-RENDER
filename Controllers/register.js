import fetch from "node-fetch";
import registro from "../Models/register.js";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.RECAPTCHA_SECRET;
const registroCliente = async (req, res) => {
  const {
    Name,
    Email,
    Password,
    ConfirmPassword,
    "g-recaptcha-response": Token
  } = req.body;

  // Validar presencia de Token
  if (!Token) {
    return res.status(400).json({
      message: "Por favor completa el reCAPTCHA."
    });
  }

  // Verificar Token con Google reCAPTCHA
  const resp = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${Token}`,
    { method: "POST" }
  );

  const data = await resp.json();


  if (!data.success) {
    return res.status(400).json({
      message: `Verificación reCAPTCHA fallida. Código(s): ${data["error-codes"]?.join(", ")}`
    });
  }

  // Registrar nuevo usuario
  const registro1 = registro({
    nombre: Name,
    correo: Email,
    contraseña: Password,
    confirmcontraseña: ConfirmPassword
  });

  await registro1.save();

  return res.status(201).json({
    message: "Usuario registrado correctamente."
  });
};

const RegisterAdminUser = async (req, res) => {
  const {
    Name,
    Email,
    Password,
    ConfirmPassword,
    Rol
  } = req.body

  const registro1 = registro({
    nombre: Name,
    correo: Email,
    contraseña: Password,
    confirmcontraseña: ConfirmPassword,
    rol: Rol
  });

  await registro1.save();
  return res.status(201).json({
    message: "Usuario registrado correctamente."
  });

}
export { registroCliente, RegisterAdminUser };
