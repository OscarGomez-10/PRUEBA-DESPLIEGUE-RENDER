import { Router } from "express";
import { check } from 'express-validator';
import { validarCampos } from "../Helpers/ValidationResult.js"
import { RegisterAdminUser,registroCliente } from "../Controllers/register.js";
import { validarJWT } from "../Middlewares/validar_jwt.js";
import { ValidateUserExists } from "../Helpers/ValidationRegister.js";
const router = Router();

router.post("/registro", [
    check("Email").custom(ValidateUserExists),
    validarCampos
], registroCliente)

router.post("/registrar/usuario/admin", [
    validarJWT,
    check("Email").custom(ValidateUserExists),
    validarCampos
], RegisterAdminUser)


export default router