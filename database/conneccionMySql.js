import { createPool } from "mysql2/promise";
import { config } from 'dotenv';
import env from 'env-var'

config();

export const pool = createPool({
    host:env.get('HOST_DB').asString(),
    port:env.get('PORT_DB').asPortNumber(),
    database:env.get('NAME_DB').asString(),
    user:env.get('USER_DB').asString(),
    password:env.get('PASSWORD_DB').asString()
});