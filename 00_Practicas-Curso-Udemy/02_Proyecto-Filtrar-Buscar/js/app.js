
//VARIABLES
const anioActual = new Date().getFullYear();
const anioMinimo = anioActual - 10;

//OBJETO
const datosBusqueda = {
    marca: '',
    anio: '',
    min:'',
    max:'',
    puertas: '',
    transmision: '',
    color: ''
}

//SELECTORES
const resultado = document.querySelector('#resultado'); //Contenedor de Resultados

const marca = document.querySelector('#marca');
const year = document.querySelector('#year');
const minimo = document.querySelector('#minimo');
const maximo = document.querySelector('#maximo');
const puertas = document.querySelector('#puertas');
const transmision = document.querySelector('#transmision');
const color = document.querySelector('#color');

//EVENT LISTENERS
document.addEventListener('DOMContentLoaded',()=>{
    mostrarAutos(coches);//Muestra la lista de autos
    selectAnios(); //llenar select años
});

//Event para los formularios, se usa "change" cuando cambia el valor del select
marca.addEventListener('change', (e)=> {
    datosBusqueda.marca = e.target.value;
    filtarAuto();
})
    
year.addEventListener('change', (e)=> {
    datosBusqueda.anio = e.target.value;
    console.log(datosBusqueda);
    filtarAuto();
})
    
minimo.addEventListener('change', (e)=> {
    datosBusqueda.min = e.target.value;
    filtarAuto();
})
    
maximo.addEventListener('change', (e)=> {
    datosBusqueda.max = e.target.value;
    filtarAuto();
})
    
puertas.addEventListener('change', (e)=> {
    datosBusqueda.puertas = e.target.value;
    filtarAuto();
})
    
transmision.addEventListener('change', (e)=> {
    datosBusqueda.transmision = e.target.value;
    filtarAuto();
})
    
color.addEventListener('change', (e)=> {
    datosBusqueda.color = e.target.value;
    filtarAuto();
})
    

//FUNCIONES

//Mostrar lista de autos
function mostrarAutos(autos){
    limpiarHTML();
    autos.forEach(auto =>{
        const {marca,modelo,year,puertas,transmision,precio,color} = auto;
        const autoHTML = document.createElement('p');

        autoHTML.textContent = `
        ${marca} ${modelo} - ${year} - Puertas: ${puertas} - Transmisión: ${transmision} - Precio: $${precio} - Color: ${color}
        `
        //Insertar en el html
        resultado.appendChild(autoHTML);
    })
}

function selectAnios(){
    for(let i = anioActual; i >= anioMinimo; i--){
        const opcion = document.createElement('option');
        opcion.value = i;
        opcion.textContent = i;
        year.appendChild(opcion);
    }
}

function filtarAuto(){
    const resultado = coches.filter(filtrarMarca).filter(filtrarYear).filter(filtrarPrecioMin).filter(filtrarPrecioMax).filter(filtrarPuertas).filter(filtrarPuTransmision).filter(filtrarColor);
    if(resultado.length){

        mostrarAutos(resultado);
        return;
    }
    noResultado();
}

function noResultado(){
    limpiarHTML();
    const noResultado = document.createElement('div');
    noResultado.classList.add('alerta','error');
    noResultado.textContent = 'No hay resultados';
    resultado.appendChild(noResultado);
}

function filtrarMarca(auto){
    const {marca} = datosBusqueda;
    if(marca){
        return auto.marca === marca;
    }
    return auto;
}

function filtrarYear(auto){
    const {anio} = datosBusqueda;
    if(anio){
        return auto.year === parseInt(anio);
    }
    return auto;
}

function filtrarPrecioMin(auto){
    const {min} = datosBusqueda;
    if(min){
        console.log('hola');
        return auto.precio >= parseInt(min);
    }
    return auto;
}

function filtrarPrecioMax(auto){
    const {max} = datosBusqueda;
    if(max){
        return auto.precio <= parseInt(max);
    }
    return auto;
}

function filtrarPuertas(auto){
    const {puertas} = datosBusqueda;
    if(puertas){
        return auto.puertas === parseInt(puertas);
    }
    return auto;
}

function filtrarPuTransmision(auto){
    const {transmision} = datosBusqueda;
    if(transmision){
        return auto.transmision === transmision;
    }
    return auto;
}

function filtrarColor(auto){
    const {color} = datosBusqueda;
    if(color){
        return auto.color === color;
    }
    return auto;
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}