import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { pool } from "../database/conneccionMySql.js";

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

            if (result.affectedRows > 0) res.status(200).json({ mensaje: 'Usuario registrado con éxito.' })
            else res.status(404).json({ error: 'Error al intentar registrar el usuario, reintente mas tarde.' })
        } catch (error) {
            res.status(500).json({ error: 'Error al intentar registrar el usuario, reintente mas tarde.' })
        }
    }

}