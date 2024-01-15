//VARIABLES
let presupuesto;

//SELECTORES
const listaGastos =  document.querySelector('#gastos ul');
const formulario = document.querySelector('#agregar-gasto');


//CLASES
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos,gasto];
        console.log(this.gastos);
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total,gasto)=> {
            return total + gasto.cantidad
        },0);
        this.restante = this.presupuesto - gastado;

    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter((gasto)=>gasto.id !== id);
        this.calcularRestante();
    }
}

class UI{
    mostrarPresupuesto(cantidad) {
        const {presupuesto,restante} = cantidad;
        //Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje,tipo){

        const div = document.createElement('div');
        div.classList.add('text-center','alert');

        if(tipo === 'error'){
            div.classList.add('alert-danger');
            div.classList.remove('alert-success');

        } else{
            div.classList.add('alert-success');
            div.classList.remove('alert-danger');
        }
        
        div.textContent = mensaje;
        //Agregar al html
        document.querySelector('.primario').insertBefore(div, formulario);

        setTimeout(() => {
            div.remove();
        }, 3000);

    }

    agregarGastoLista(gastos){

        this.limpiarListadoHTML(); //Elimina html previo

        //Iterar sobre los gastos

        gastos.forEach(gasto =>{
            const {cantidad,nombre,id} = gasto;

            //Crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            
            //Agregar el html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`
            
            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = ()=>{
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            
            //Agregar al html
            listaGastos.appendChild(nuevoGasto);
        })
    }

    limpiarListadoHTML(){
        while(listaGastos.firstChild){
            listaGastos.removeChild(listaGastos.firstChild);
        }
    }

    actuaizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        //comprobar 25%
        if((presupuesto*0.25)>restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.remove('alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if((presupuesto*0.5)>restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.remove('alert-danger');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger','alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //Si el total es 0 o menor
        if(restante <= 0){
            ui.imprimirAlerta('El presupesto se ha agotado','error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

//INSTANCIAR
const ui = new UI();

//EVENT LISTENERS
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto);

    formulario.addEventListener('submit',agregarGasto);
}


//FUNCIONES

//Preguntamos al usuario su presupuesto
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('Cuál es tú presupuesto?');

    if(presupuestoUsuario==='' || presupuestoUsuario === null || presupuestoUsuario <= 0 || isNaN(presupuestoUsuario) ){
        window.location.reload(); //Recargamos la ventana actual.
        return;
    }

    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.mostrarPresupuesto(presupuesto);

}

function agregarGasto(e){
    e.preventDefault();

    //Leer datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //Validar
    if(nombre===''||cantidad===''){
        ui.imprimirAlerta('Los campos son obligatorios','error');
        return;
    } else if(cantidad<=0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida','error');
        return;
    }
    
    //Generar objeto con el gasto
    const gasto = {
        nombre,
        cantidad,
        id: Date.now() //Agregamos un id unico
    };
    
    //Añadir nuevo gasto
    presupuesto.nuevoGasto(gasto);
    ui.imprimirAlerta('Gasto agregado correctamente');

    //Imprimir los gastos
    const {gastos,restante} = presupuesto;
    ui.agregarGastoLista(gastos);

    ui.actuaizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //Reinicia el Formulario
    formulario.reset();

}

function eliminarGasto(id){
    //Elimina los gastos del objeto
    presupuesto.eliminarGasto(id);

    //Elimina los gastos del html
    const {gastos,restante} = presupuesto;
    ui.agregarGastoLista(gastos);
    ui.actuaizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}