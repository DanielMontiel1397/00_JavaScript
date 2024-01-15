/*VARIABLES */
let carritoCompras = [];

/*SELECTORES DE ELEMENTOS*/
const carrito = document.querySelector('#carrito');
const listaCarrito = document.querySelector('#lista-carrito tbody');
const btnVaciarCarrito = document.querySelector('#vaciar-carrito');

const listaCursos = document.querySelector('#lista-cursos');

/*EVENT LISTENERS */

cargarEventListeners();
function cargarEventListeners(){
    //Presionar bóton "Agregar Curso"
    listaCursos.addEventListener('click',agregarCurso);

    //elimina cursos del carrito
    carrito.addEventListener('click',eliminarCurso);

    btnVaciarCarrito.addEventListener('click',(e)=>{
        e.preventDefault();
        carritoCompras = []; //Limpiamos el arreglo
        carritoHTML();
    });
}

/*FUNCIONES */
function agregarCurso(e){
    /*Cuando agregas un enlace va a querer ir al link, asi que como no 
    estamos conectamos a una base de datos evitamos ese evente */

    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        /*Seleccionamos el elemento padre del boton 
        para obtener toda la informacion del curso*/
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
}

//Lee el contenido del html del curso y extraer información
function leerDatosCurso(curso){
    console.log(curso);

    //Crear objeto con el contenido del curso
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };

    //Revisa si un elemento ya existe en el carrito
    const existe = carritoCompras.some(curso => curso.id === infoCurso.id);
    
    /*Si el elemento ya existe aumentamos la cantidad */
    if(existe){

        //Actualizamos la cantidad
        const cursos = carritoCompras.map(curso => {
            if(curso.id === infoCurso.id){
                curso.cantidad++;
                return curso;
            }
            else{
                return curso;
            }
        });

        /*Reescribimos "carritoCompras" con el nuevo arreglo donde se actualizo la cantidad*/
        carritoCompras = [...cursos];
        //volvemos a imprimir el html
        carritoHTML();
        return;
    } 
        
    carritoCompras = [...carritoCompras,infoCurso];
    carritoHTML();
}

//Muestra el Carrito de compras en el HTML
function carritoHTML(){

    limpiarHTML();

    carritoCompras.forEach(curso=>{
        const {imagen,titulo,precio,cantidad,id} = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${curso.cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}" >X</a>
            </td>
        `;
        //Agregar el HTML del carrito al tbody
        listaCarrito.appendChild(row);
    });
}


//Limpiar el HTML del carrito
function limpiarHTML(){
    while(listaCarrito.firstChild){
        listaCarrito.removeChild(listaCarrito.firstChild);
    }
}

//eliminar curso
function eliminarCurso(e){
    e.preventDefault();

    if(e.target.classList.contains('borrar-curso')){
        const cursoBorrar = e.target.getAttribute('data-id');
        
        //Elimina del arreglo
        carritoCompras = carritoCompras.filter(curso => curso.id !==cursoBorrar);
        carritoHTML();
    }
}   

