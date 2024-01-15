//VARIABLES

//SELECTORES
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#cotizar-seguro');

const marca = document.querySelector('#marca');
const selecYear = document.querySelector('#year');

const spinner = document.querySelector('#cargando');

//CONSTRUCTOR
function Seguro(marca,anio,cobertura){
    this.marca = marca;
    this.anio = anio;
    this.cobertura = cobertura;
}

function UI(){ //Interfaz de usuario

}

//PROTOTYPES

//Prototype de UI para llenar opciones
UI.prototype.llenarOpciones = () =>{
    const anioActual = new Date().getFullYear(),
        min = anioActual - 20;


    for(let i=anioActual; i>=min; i--){
        let option = document.createElement('option');
            option.textContent = i;
            option.value = i;
            selecYear.appendChild(option);
    }
}

//Prototype de UI para mostrar alertas
UI.prototype.mostrarMensaje = (mensaje,tipo) =>{
    const div = document.createElement('div');

    if(tipo === 'error'){
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje','mt-10');

    div.textContent = mensaje;
    formulario.insertBefore(div,resultado);

    //Borrar mensaje después de 3 segundos
    setTimeout(()=>{
        div.remove();
    },3000);

}

//Prototype de UI para mostrar resultado
UI.prototype.mostrarResultado = (total,seguro)=>{
    const {marca,anio,cobertura} = seguro;

    let textoMarca;
    switch(marca){
        case '1':
            textoMarca = 'Americano';
            break;
        case '2':
            textoMarca = 'Asiatico';
            break;
        case '3':
            textoMarca = 'Europeo';
            break;
        default:
            break;
    }

    //Crear el resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header">Tu resumen</p>
        <p class="font-bold"> Marca: <span class="font-normal"> ${textoMarca} </span> </p>
        <p class="font-bold"> Año: <span class="font-normal"> ${anio} </span> </p>
        <p class="font-bold"> Tipo: <span class="font-normal capitalize"> ${cobertura} </span> </p>
        <p class="font-bold"> Total: <span class="font-normal">$ ${total} </span> </p>
    `
    
    //Mostrar el spinner
    spinner.style.display = 'block';
    setTimeout(()=>{
        spinner.style.display = 'none'; //Se borra el spinner
        resultado.appendChild(div); //Se muestra el resultado
    },3000);
}

//Prototype de Seguro para cotizar los datos
Seguro.prototype.cotizarSeguro = function(){
    /*
        1= Americano 1.15
        2 = Asiatico 1.05
        3 = Europeo 1.35
    */
    let cantidad;
    const base = 2000;

    switch(this.marca){
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
        default:
            break;
    }

    //Leer el año
    const diferencia = new Date().getFullYear() - this.anio;

    /* Cada año que la diferencia es mayor, el costo va a reducir un 3%*/
    cantidad -= (diferencia*0.03) * cantidad;

    /*
        Si el seguro es básico se multiplica por un 30% más
        Si el seguro es completo se multiplica por un 50% más
    */
        if(this.cobertura === 'basico'){
            cantidad *= 1.3;
        } else {
            cantidad *=1.5;
        }
    return cantidad;
}

//INSTANCIAR
const ui = new UI();
console.log(ui);

//EVENT LISTENERS
document.addEventListener('DOMContentLoaded',()=>{
    ui.llenarOpciones(); //Llena el "Select" con los años
})

eventListener();
function eventListener(){
    formulario.addEventListener('submit',cotizarSeguro);
}

//FUNCIONES

function cotizarSeguro(e){
    e.preventDefault();

    const valorMarca = marca.value;
    const valorYear = selecYear.value;
    const valorTipo = document.querySelector('input[name="tipo"]:checked').value;

    if(valorMarca === '' || valorYear === '' || valorTipo === ''){
        ui.mostrarMensaje('Faltan campos por llenar','error')
        return;
    }
    ui.mostrarMensaje('Cotizando...');

    //Ocultar las cotizaciones previas
    const resultados = document.querySelector('#resultado div');
    if(resultados !== null){
        resultados.remove();
    }

    //Instanciar el seguro
    const seguro = new Seguro(valorMarca,valorYear,valorTipo);

    const total = seguro.cotizarSeguro();
    console.log(total);
    ui.mostrarResultado(total,seguro)
}