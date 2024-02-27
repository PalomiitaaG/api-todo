const contenedorTareas = document.querySelector(".tareas");
const forumulario = document.querySelector("form");
const input = document.querySelector('form input[type="text"]');

fetch("/api-todo") //con este leemos toda la tarea de la api.
.then(respuesta => respuesta.json())
.then(tareas => {
    tareas.forEach(({id,tarea,terminada}) => {
        new Tarea(id,tarea,terminada,contenedorTareas); // los datos son lo de la base de datos y el contenedor es donde lo vas a colocar en el front. 
    });
});

forumulario.addEventListener("submit", evento => {
    evento.preventDefault()
    // | console.log(input.value); | con el input.value muestra lo que el usurio escribe en el input. Te muestra el valor del input

    if(/^[a-záéíóú][a-záéíóú0-9 ]*$/i.test(input.value)){ //al principio para que no lleve numeros. Con test buscamos que en el value corrovore la si cumple esos parametros
        return fetch("/api-todo/crear/", { // y aqui ya creamos la tarea.
            method : "POST",
            body : JSON.stringify({tarea : input.value}),
            headers : {
                "Content-type" : "application/json"
            }
        })
        .then(respuesta => respuesta.json())
        .then(({id}) => {
            if(id){
                new Tarea(id,input.value.trim(),false,contenedorTareas);  // te da el id para representarlo en el front
                return input.value = "";
            }
            console.log("error en el formulario");
        });
    } 
    console.log("error en el formulario");
    
});