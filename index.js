import express from "express";
import dotenv from 'dotenv';
import rutas_registro from "./Routers/register.js";
import login from "./Routers/login.js";
import dash from "./Routers/dash.js"
import mongoose from "mongoose";
import cors from "cors";


const app = express();
dotenv.config();
app.use(cors());

app.use(express.json());
app.use("/api", rutas_registro);
app.use("/apiLogin", login)
app.use("/das", dash)
app.use(express.static('Public'));

mongoose.connect(process.env.MONGODB_CNX)
  .then(() => console.log("se conectó a MongoDB"))
  .catch(err => console.error("Error al conectar a MongoDB:", err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
  
