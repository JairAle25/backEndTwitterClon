import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { pool } from "../database/conneccionMySql.js";
import jwt from 'jsonwebtoken'

export default class UsuariosController{

     getAllUsers=async(req,res)=>{
        try {
            const [results] = await pool.query("select * from usuarios")
            res.json(results);
        } catch (error) {
            
        }
    }

    createUser = async (req, res) => {
        const { nombre,nombreUsuario,correo,contrasena } = req.body

        try {
            ///VERIFICO SI EL USUARIO YA EXISTE
            const [exists] = await pool.query('select 1 from usuarios where correoElectronico = ?', [correo])
            if (exists.length > 0) {
                return res.status(400).json({ error: 'Usuario ya registrado.' })
            }
            ///CREO LA ID RANDOM Y HASHEO LA CONTRASEÑA
            const idUser = crypto.randomUUID();
            const hashedPassword = await bcrypt.hash(contrasena, 10)

            ///INGRESO LOS DATOS A LA BASE DE DATOS
            const [result] = await pool.query('insert into usuarios (idUsuario,nombre,nombreUsuario,correoElectronico ,contrasenia) values (?,?,?,?,?);',
                [idUser, nombre,nombreUsuario,correo, hashedPassword])

            ///SI HAY UNA FILA INGRESADA ESTA CORRECTO
            if (result.affectedRows > 0) res.status(200).json({ mensaje: 'Usuario registrado con éxito.' })
            else res.status(404).json({ error: 'Error al intentar registrar el usuario, reintente mas tarde.' })
        } catch (error) {
            res.status(500).json({ error: 'Error al intentar registrar el usuario, reintente mas tarde.' })
        }
    }

    login = async (req, res) => {
      const { correo, contrasena } = req.body;
    
      try {
        const [results] = await pool.query("SELECT * FROM usuarios WHERE correoElectronico = ?", [correo]);

        if (results.length === 0) {
          return res.json({ error: "CORREO O CONTRASEÑA INCORRECTA" });
        }
        const user = results[0];

        const isValid = await bcrypt.compare(contrasena,user["contrasenia"]);

        if(!isValid){
          return res.json({ error: "CORREO O CONTRASEÑA INCORRECTA" });
        }
        const {nombre,biografia,fechaDeIngreso,ubicacion,sitioWeb,fotoPerfil,fotoBanner,correoElectronico,nombreUsuario,verificado} = user;

        const token = jwt.sign({
          nombre,
          biografia,
          fechaDeIngreso,
          ubicacion,
          sitioWeb,
          fotoPerfil,
          fotoBanner,
          correoElectronico,
          nombreUsuario,
          verificado
        },process.env.KEY_JWT,
        { 
            expiresIn: '1h' 
        })

        res.cookie('access_token', token, { httpOnly: true, sameSite: 'Lax' });
        res.status(200).json({mensaje:"INGRESADO EXITOSAMENTE"})

      } catch (error) {
        return res.status(500).json({ error: "ERROR AL LOGUEARSE" });
      }
    };

    getMyUserData(req,res){
      const userData = req.user;
      if(!userData){
          throw new Error("ERROR AL OBTENER LOS DATOS")
      }
      res.status(200).json(userData)
    }

}