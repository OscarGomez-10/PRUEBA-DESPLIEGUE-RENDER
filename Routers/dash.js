import { Router } from "express";
import { validarJWT } from "../Middlewares/validar_jwt.js";
import { dash, actualizarUsuario } from "../Controllers/dash.js";

const router = Router()

router.get("/dash", validarJWT, dash)
router.put("/actualizar", [validarJWT
], actualizarUsuario);


export default router