const criptoMonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const divResultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
};

//Crear promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
})

//Event Listener

document.addEventListener('DOMContentLoaded',()=>{
    consultarCriptomonedas();
    formulario.addEventListener('submit',submitFormulario);
    criptoMonedasSelect.addEventListener('change',leerValor);
    monedaSelect.addEventListener('change',leerValor);
})

//Consultar API de Cripto Monedas
function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

//Crear html Select Cripto Monedas
function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach( cripto =>{
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;

        criptoMonedasSelect.appendChild(option);
    })
}


//Leer valores seleccionados
function leerValor(e){
    
    objBusqueda[e.target.name] = e.target.value;
}

//Enviar formulario
function submitFormulario(e){
    e.preventDefault();

    //validar
    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta("Ambos campos son obligatorios");
    }

    //Consultar API con los resultados
    consultarAPI();
}

//Mostrar mensajes de Alerta
function mostrarAlerta(mensaje){

    //Eliminar mensaje
    const existeError = document.querySelector('.error');

    if(existeError){
        const mensajeAlerta = document.createElement('div');
        mensajeAlerta.classList.add('error');
    
        //Mensaje de error
        mensajeAlerta.textContent = mensaje;
    
        formulario.appendChild(mensajeAlerta);

        setTimeout(() => {
            mensajeAlerta.remove();
        }, 3000);
    }


}

function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            mostrarHTML(resultado.DISPLAY[criptomoneda][moneda]);
        })
}

function mostrarHTML(cotizacion){
    
    limpiarHTML();

    const {PRICE, HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto del día <span>${HIGHDAY}</span>`;
    
    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo del día <span>${LOWDAY}</span>`;
    
    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variacion últimas 24 horas <span>${CHANGEPCT24HOUR} %</span>`;
    
    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Última actualización <span>${LASTUPDATE}</span>`;

    divResultado.appendChild(precio);
    divResultado.appendChild(precioAlto);
    divResultado.appendChild(precioBajo);
    divResultado.appendChild(ultimasHoras);
    divResultado.appendChild(ultimaActualizacion);
}

function limpiarHTML(){
    while(divResultado.firstChild){
        divResultado.removeChild(divResultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
    `
    resultado.appendChild(spinner);
}