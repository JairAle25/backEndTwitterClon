import express from 'express'
import { config } from 'dotenv';
import env from 'env-var'
import cors from 'cors';
import UsuariosRoutes from './routes/usuarios.routes.js';

config();

const app = express();
const PORT = env.get('PORT').required().asPortNumber();
app.use(cors());
app.use(express.urlencoded({ extended:true }))
app.use(express.json({ type:"*/*" }))

const usuarios = new UsuariosRoutes();
app.use("/usuarios",usuarios.router)

app.listen(PORT,()=>{
    console.clear()
    console.log(`escuchando en http://localhost:${PORT}`)
})