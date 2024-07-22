import Routes from "./routes.js";
import UsuariosController from "../controllers/usuarios.controllers.js";
import { authenticateToken } from "../auth/usuarioAuth.js";

export default class UsuariosRoutes extends Routes{

    constructor(){
        super();
        this.usuariosC = new UsuariosController();
        this.getRoutes();
    }

    getRoutes=()=>{
        this.router
            .get("/",this.usuariosC.getAllUsers)
            .get("/user/:username",this.usuariosC.getUserByUsername)
            .get("/myUser",authenticateToken,this.usuariosC.getMyUserData)
            .post("/register",this.usuariosC.createUser)
            .post("/login",this.usuariosC.login)
    }
}