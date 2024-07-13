import { error } from "console";
import { pool } from "../database/conneccionMySql.js";

export default class UsuariosController{

     getAllUsers=async(req,res)=>{
        try {
            const [results] = await pool.query("select * from usuarios")
            res.json(results);
        } catch (error) {
            
        }
    }

}