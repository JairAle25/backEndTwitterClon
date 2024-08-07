import express from 'express'
import { config } from 'dotenv';
import env from 'env-var'
import cors from 'cors';
import UsuariosRoutes from './routes/usuarios.routes.js';
import cookieParser from 'cookie-parser';

config();

const app = express();
const PORT = env.get('PORT').required().asPortNumber();


app.use(cookieParser())
app.use(express.urlencoded({ extended:true }))
app.use(express.json({ type:"*/*" }))

const allowedOrigins = [env.get('HOST_SERVER').required().asString()];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));



const usuarios = new UsuariosRoutes();
app.use("/usuarios",usuarios.router)

app.listen(PORT,()=>{
    console.clear()
    console.log(`escuchando en http://localhost:${PORT}`)
})