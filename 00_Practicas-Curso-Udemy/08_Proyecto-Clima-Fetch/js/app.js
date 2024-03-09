//SELECTORES
const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load',()=>{
    formulario.addEventListener('submit',buscarClima);
})


function buscarClima(e){
    e.preventDefault();

    //Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === ''){
        //Error
        mostrarError('Ambos campos son obligatorios');
        
        return;
    }

    //Consultar API
    consultarAPI(ciudad,pais);
}

function mostrarError(mensaje){

    const alerta = document.querySelector('.bg-red-100');

    
    if(!alerta){
        //Crear alerta
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-md','mx-auto','mt-6','text-center');
    
        alerta.innerHTML = `
            <strong class="font-bold">Error</strong>
            <span class="block">${mensaje}</span>
        `;

        container.appendChild(alerta);

        setTimeout(()=>{
            alerta.remove();
        },3000);
    }
}

function consultarAPI(ciudad,pais){

    const appId = 'e755eb5597dd7a8cad156bff1ff2a4c2';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
    
    //Muestra Spinner de carga
    spinner();

    fetch(url)
        .then(resultado =>  resultado.json())
        .then( respuesta => {
            limpiarHTML();
            if(respuesta.cod === '404'){
                mostrarError('Ciudad no encontrada');
                return;
            }
            mostrarHTML(respuesta);
        });

}

function mostrarHTML(datos){

    const {name, main: { temp, temp_max, temp_min }} = datos;
    
    const centigrados = kelvinAcentigrados(temp);
    const centigradosMax = kelvinAcentigrados(temp_max);
    const centigradosMin = kelvinAcentigrados(temp_min);

    const nombreCiudad = document.createElement('p');

    nombreCiudad.textContent = `Clima en: ${name}`;
    nombreCiudad.classList.add('font-bold','text-2xl');

    const tempMax = document.createElement('p');
    tempMax.innerHTML = `
        MAX: ${centigradosMax} &#8451;
    `;

    const tempMin = document.createElement('p');
    tempMin.innerHTML = `
        MIN: ${centigradosMin} &#8451;
    `;

    tempMax.classList.add('text-xl');
    tempMin.classList.add('text-xl');

    const actual = document.createElement('p');
    actual.innerHTML = `
        ${centigrados} &#8451;
    `;

    actual.classList.add('font-bold','text-6xl');

    const resultadoDiv = document.createElement('div');

    resultadoDiv.classList.add('text-center','text-white');

    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(tempMin);


    resultado.appendChild(resultadoDiv);
}

function kelvinAcentigrados(grados){
    return parseInt(grados-274.15);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function spinner(){
    limpiarHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');

    divSpinner.innerHTML = `
        <div class="sk-circle1 sk-child"></div>
        <div class="sk-circle2 sk-child"></div>
        <div class="sk-circle3 sk-child"></div>
        <div class="sk-circle4 sk-child"></div>
        <div class="sk-circle5 sk-child"></div>
        <div class="sk-circle6 sk-child"></div>
        <div class="sk-circle7 sk-child"></div>
        <div class="sk-circle8 sk-child"></div>
        <div class="sk-circle9 sk-child"></div>
        <div class="sk-circle10 sk-child"></div>
        <div class="sk-circle11 sk-child"></div>
        <div class="sk-circle12 sk-child"></div>
    `;

    resultado.appendChild(divSpinner);
}