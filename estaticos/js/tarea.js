class Tarea{ //esto solo es una tarea unica, que engloba las funciones. por eso se invoca el fech en funciones. Por que no se puede crear a si misma.
    constructor(id,textoTarea,estado,contenedor){ //contenedor es donde voy a enganchar ese html.
        this.id = id;
        this.textoTarea = textoTarea;
        this.DOM = null; //componente HTML
        this.editando = false; // si la calse es false no se coloca, si es tru se coloca.
        this.crearComponente(estado,contenedor);//los pasas como argumentos por que solo lo voy a necesitar para cuando creo la tarea.
    }
    crearComponente(estado,contenedor){ //el contenedor es la section donde lo metemos.
        this.DOM = document.createElement("div");
        this.DOM.classList.add("tarea");

        //TEXTO TAREA
        let textoTarea = document.createElement("h2");
        textoTarea.classList.add("visible");
        textoTarea.innerText = this.textoTarea;

        //input 
        let inputTarea = document.createElement("input");
        inputTarea.setAttribute("type","text");
        inputTarea.value = this.textoTarea;

        //boton editar
        let botonEditar = document.createElement("button");
        botonEditar.classList.add("boton");
        botonEditar.innerText = "Editar";

        botonEditar.addEventListener("click", () => this.editarTarea());

        //boton borrar
        let botonBorrar = document.createElement("button");
        botonBorrar.classList.add("boton");
        botonBorrar.innerText = "Borrar";
        botonBorrar.addEventListener("click", () => this.borrarTarea()); //this como esta dentro de la funcion flecha que no crea contexto se refiere al objeto.

        //boton estado
        let botonEstado = document.createElement("button");
        botonEstado.classList.add("estado", estado ? "terminada" : null); //Si el esatado es true le colocamos "terminada", y si es false se coloca null.Cuando lo creamos el estado saldra null.
        botonEstado.appendChild(document.createElement("span"));

        botonEstado.addEventListener("click", () =>{
            this.toggleEstado().then(({resultado}) =>{
                if(resultado == "ok"){
                    return botonEstado.classList.toggle("terminada");
                }
                console.log("error actualizado");
            });
                
        });

        this.DOM.appendChild(textoTarea);
        this.DOM.appendChild(inputTarea);
        this.DOM.appendChild(botonEditar);
        this.DOM.appendChild(botonBorrar);
        this.DOM.appendChild(botonEstado);
        contenedor.appendChild(this.DOM);
    }
    //metodos

    //las funciones flechas  no crean contexto
    borrarTarea(){
        fetch("/api-todo/borrar/" + this.id, { //tienes que especificar el metodo por que si no haria el metodo get
            method : "DELETE"
        })
        .then(respuesta => respuesta.json())
        .then(({resultado}) => {
            if(resultado == "ok"){
                return this.DOM.remove(); //se coloca DOM por que es la pantalla. Para que no se muestre en la pantalla.
            }
            console.log("error al borrar");
        });
    
    }

    toggleEstado(){
        return fetch(`/api-todo/actualizar/${this.id}/2`,{ //aqui se retorna ya que el boton estan en un scope diferente.
                method : "PUT"
            })
            .then(respuesta => respuesta.json())
        /*return new Promise(callback => {
            callback();
        });*/
    }

    async editarTarea(){
        if(this.editando){
            //guardar
            //se colocará el código de la base de datos.
            let textoTemporal = this.DOM.children[1].value; //lo que escribe el usuario.

            if(textoTemporal.trim() != "" && textoTemporal.trim() != this.textoTarea){
                let {resultado} = await fetch(`h/api-todo/actualizar/${this.id}/1`,{
                                            method : "PUT",
                                            body : JSON.stringify({ tarea : textoTemporal.trim()}),
                                            headers : {
                                                "Content-type" : "application/json"
                                            }
                                        })
                                        .then(respuesta => respuesta.json())
                if(resultado == "ok"){
                    this.textoTarea = textoTemporal;
                }
            }
                

            this.DOM.children[0].innerText = this.textoTarea;
            this.DOM.children[0].classList.add("visible");
            this.DOM.children[1].classList.remove("visible");
            this.DOM.children[2].innerText = "Editar";
            this.editando = false;
            
        }else{
            //editar
            this.DOM.children[0].classList.remove("visible");
            this.DOM.children[1].value = this.textoTarea;
            this.DOM.children[1].classList.add("visible");
            this.DOM.children[2].innerText = "Guardar";
            this.editando = true;
        }
    }
}