import Routes from "./routes.js";
import UsuariosController from "../controllers/usuarios.controllers.js";

export default class UsuariosRoutes extends Routes{

    constructor(){
        super();
        this.usuariosC = new UsuariosController();
        this.getRoutes();
    }

    getRoutes=()=>{
        this.router
            .get("/",this.usuariosC.getAllUsers)
    }
}