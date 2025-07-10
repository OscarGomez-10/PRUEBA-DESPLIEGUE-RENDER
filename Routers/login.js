import { Router } from "express";
import { check } from "express-validator";
import { ValidatePerson} from "../Helpers/ValidationPerson.js";
import { login } from "../Controllers/login.js";
import { validarCampos } from "../Helpers/ValidationResult.js";
const router = Router()
router.post("/login",
    [
        check("email").notEmpty(),
        check("email").isEmail().withMessage("EL FORMATO DEL CORREO ES INCORRECTO"),
        check("password").notEmpty(),
        check("password").isLength({min: 8}).withMessage("LA CONTRASEÑA DEBE TENER MINIMO 8 CARACTERES"),
        check("email").custom(ValidatePerson),
        validarCampos
    ], login)


export default router