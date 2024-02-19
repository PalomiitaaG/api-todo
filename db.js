require("dotenv").config();

const postgres = require("postgres");

function conectar(){
    return postgres({
        host : process.env.DB_HOST,
        database : process.env.DB_NAME,
        user :  process.env.DB_USER,
        password :  process.env.DB_PASSWORD
    });
}

function getTareas(){
    return new Promise(async (ok,ko) =>{ //2callback. 1 para cuando se cumpla y otra para cuando no
        let conexion = conectar();

        try{
            let tareas = await conexion`SELECT * FROM tareas`; //para buscarlos en la base de datos

            conexion.end();

            ok(tareas); //cumplir la promesa pasando los colores.
        }catch(error){
            ko({error : "error en la base de datos"}); //esto seria un objeto
        }

    }); 
}

function crearTareas({tarea}){
    return new Promise(async (ok,ko) =>{ //2callback. 1 para cuando se cumpla y otra para cuando no
        let conexion = conectar();

        try{
            let [{id}] = await conexion`INSERT INTO tareas (tarea) VALUES (${tarea}) RETURNING id`; //para buscarlos en la base de datos

            conexion.end();

            ok(id); //cumplir la promesa pasando los colores.
        }catch(error){
            ko({error : "error en la base de datos"}); //esto seria un objeto
        }

    }); 
}

function borrarTarea(id){
    return new Promise(async (ok,ko) =>{ //2callback. 1 para cuando se cumpla y otra para cuando no
        let conexion = conectar();

        try{
            let {count} = await conexion`DELETE FROM tareas WHERE id = ${id}`; //cuando borro el array estaria vacio por eso le pongo el count para que te muestre el objeto que se ha borrado. 

            conexion.end();

            ok(count);
        }catch(error){
            ko({error : "error en la base de datos"}); //esto seria un objeto
        }

    }); 
}

module.exports = {getTareas,crearTareas,borrarTarea};