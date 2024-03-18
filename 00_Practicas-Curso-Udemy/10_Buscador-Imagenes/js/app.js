//Selectores
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginadorDiv = document.querySelector('#paginacion');

//Variables
const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

addEventListener('DOMContentLoaded',()=>{
    formulario.addEventListener('submit',validarFormulario);
})

function validarFormulario(e){
    e.preventDefault();
    
    const terminoBusqueda = document.querySelector('#termino').value;
    
    //Validamos que los campos se hayan llenado correctamente
    if(terminoBusqueda === ''){
        mostrarAlerta("Agrega un término de búsqueda");
        return;
    }

    buscarImagenes();
}

//Mostramos alerta
function mostrarAlerta(mensaje){
    
    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta){
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center');
    
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class"block sm:inline">${mensaje}</span>
        `;
    
        formulario.appendChild(alerta);
    
        setTimeout(()=>{
            alerta.remove()
        },3000);
    }
}

//Buscamos imagenes en la API
function buscarImagenes(){

    const termino = document.querySelector('#termino').value;

    const key = "42896366-24ed601867dbdd68392f2047c";
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then(resultado => resultado.json())
        .then(imagenes => {
            totalPaginas = calcularPaginas(imagenes.totalHits)
            mostrarImagenes(imagenes.hits);
        })
            
}

//Calcular el numero de paginas
function calcularPaginas(total){
    return parseInt(Math.ceil(total/registrosPorPagina));
}

//Generador para registrar cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total){
    for(let i = 1; i<=total; i++){
        yield i;
    }
}

//Mostramos las imagenes en el html
function mostrarImagenes(imagenes){
    
    //Limpiar html
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

    //Iterar sobre imagenes
    imagenes.forEach(imagen =>{
        const {previewURL,likes,views,largeImageURL} = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}" >

                    <div class="p-4">
                        <p class="font-bold"> ${likes} <span class="font-light"> Me gusta</span> </p>
                        <p class="font-bold"> ${views} <span class="font-light"> Veces Vista</span> </p>

                        <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer" 
                        class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1">
                            Ver Imagen
                        </a>

                    </div>
                </div>
            </div>
        `
    })

    //Llimpiar paginador previo
    while(paginadorDiv.firstChild){
        paginadorDiv.removeChild(paginadorDiv.firstChild);
    };

    //Generar html de paginador
    imprimirPaginador();
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);
    
    while(true){
        const {value,done} = iterador.next();
        if(done) return;

        //Caso contrario, genera un boton por cada pagina 
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400','px-4','py-1','mr-2','mb-4','font-bold','rounded');

        boton.onclick = ()=>{
            paginaActual = value;

            buscarImagenes();
        }

        paginadorDiv.appendChild(boton);
    }
}
