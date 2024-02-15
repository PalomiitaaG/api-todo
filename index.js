require("dotenv").config();
const express = require("express");
const {getTareas,crearTareas} = require("./db");
const {json} = require("body-parser");

const servidor = express();

servidor.use(json());

servidor.use("/pruebas", express.static("./pruebas_api"));

servidor.get("/api-todo", async (peticion,respuesta) => {
    try{
        let tareas = await getTareas();
        respuesta.json(tareas);
    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
});

servidor.post("/api-todo/crear", async (peticion,respuesta,siguiente) => {
    let {tarea} = peticion.body;
    
    if(tarea && tarea.trim() != ""){ //quierre decir que me han enviado almenos una letra.
        return respuesta.send("metodo POST");
    }

    siguiente("..no me enviaste tareas"); //throw es como un return, es del catch te devuelve el error. No se puede hacer throw en una promesa asincona.
    //siguiente te lleva directamente a servidor.use donde esta el error. 
   
});

servidor.put("/api-todo", (peticion,respuesta) => {
    respuesta.send("metodo PUT");
});

servidor.delete("/api-todo", (peticion,respuesta) => {
    respuesta.send("metodo DELETE");
});

servidor.use("/", (peticion,respuesta) => {
    respuesta.json({error : "not found"});
});

servidor.use((error,peticion,respuesta,siguiente) =>{ //express sabra que este se utilizara unicamente cuando haya un error. Por ejemplo en el caso de que coloquemos mal algo de los argumentos de string en el body. Solo hace esa funcion si hay 4 argummentos.
    respuesta.send("..error");
});


servidor.listen(process.env.PORT);
//para cuando lo subamos a internet 
//en el que subamos a internet no hace falta el env