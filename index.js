require("dotenv").config();
const express = require("express");
const {getTareas,crearTareas,borrarTarea} = require("./db");
const {json} = require("body-parser"); // añade solo la propiedad de json de body-parser

const servidor = express();

/// TODO ESTO SON MIDDLEWARE

servidor.use(json());//toda peticion va a pasar por ahi, creara un objeto llamado body en el objeto.(siempre estára vacio excepto que el body tenga el content type: json)

servidor.use("/pruebas", express.static("./pruebas_api")); //usamos un metodo generico, para configurar una carpeta como carpeta de ficheros estaticos. Si ponemos /prueba te sirve el index.

// MIDDLEWARE ESPECIFICOS

servidor.get("/api-todo", async (peticion,respuesta) => {
    try{
        let tareas = await getTareas(); //si la priomesa se cumple tendre las tareas dentro y en la respuesta lo convierto en string
        respuesta.json(tareas);
    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
});

servidor.post("/api-todo/crear", async (peticion,respuesta,siguiente) => {
    let {tarea} = peticion.body;
    
    if(tarea && tarea.trim() != ""){ //quierre decir que me han enviado almenos una letra.
       try{
            let id = await crearTareas({tarea}); //o peticion.body que sabemos que con el body parser lleva la rarea en su body.
            return respuesta.json({id}); //debe de retornar para que no pase al siguiente. //la base de datos te da un numero y ahi creas un objeto que ponga id = "numero"
       }catch(error){
            respuesta.status(500);
            return respuesta.json(error);
       }
        
    }

    siguiente({error : "falta el argumento tarea en el objeto JSON"}); //throw es como un return, es del catch te devuelve el error. No se puede hacer throw en una promesa asincona.
    //siguiente te lleva directamente a servidor.use donde esta el error. 
    //Cuando pongo siguiente en un metodo especifico con una url especifica queiere decir que se ha producido un error,
   
});

servidor.put("/api-todo", (peticion,respuesta) => {
    respuesta.send("metodo PUT");
});

servidor.delete("/api-todo/borrar/:id", async (peticion,respuesta) => {
    try{
        let cantidad = await borrarTarea(peticion.params.id);
        return respuesta.json({resultado : cantidad ? "ok" : "ko"});
    }catch(error){
        respuesta.json(500);
        return respuesta.json(error);
    }
});


// este middleware es para cuando no es un error del metodo. ERROR 404
servidor.use("/", (peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({error : "not found"});
});

servidor.use((error,peticion,respuesta,siguiente) =>{ //express sabra que este se utilizara unicamente cuando haya un error. Por ejemplo en el caso de que coloquemos mal algo de los argumentos de string en el body. Solo hace esa funcion si hay 4 argummentos.
    respuesta.status(400); // bad request --> has hecho un apeticion con datos no validos.
    respuesta.json({error: "peticion no válida"});
});


servidor.listen(process.env.PORT);
//para cuando lo subamos a internet 
//en el que subamos a internet no hace falta el env