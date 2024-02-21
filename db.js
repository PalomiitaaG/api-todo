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

function actualizarEstado(id){
    return new Promise(async (ok,ko) =>{ //2callback. 1 para cuando se cumpla y otra para cuando no
        let conexion = conectar();

        try{
            let {count} = await conexion`UPDATE tareas SET terminada = NOT terminada WHERE id=${id}`; //hacer un toggle si tiene  terminada se lo cambia a no terminada y asi del reves. Lo que hace es invertir la informacion de terminada.
            conexion.end();

            ok(count);
        }catch(error){
            ko({error : "error en la base de datos"}); //esto seria un objeto
        }

    }); 
}

function actualizarTexto(id,tarea){
    return new Promise(async (ok,ko) =>{ //2callback. 1 para cuando se cumpla y otra para cuando no
        let conexion = conectar();

        try{
            let {count} = await conexion`UPDATE tareas SET tarea = ${tarea} WHERE id=${id}`; // le estas diciendo que coja el campo tareas y le añades la nueva tarea que nos ha puesto el usuario y nos da el id
            conexion.end();

            ok(count);
        }catch(error){
            ko({error : "error en la base de datos"}); //esto seria un objeto
        }

    }); 
}

module.exports = {getTareas,crearTareas,borrarTarea,actualizarEstado,actualizarTexto};