let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
};

//SELECTORES
const btnGuardarCliente = document.querySelector('#guardar-cliente');

//EVENT LISTENERS
btnGuardarCliente.addEventListener('click', validarFormulario);


//FUNCIONES

function validarFormulario(){
    
    //Leer contenido de inputs
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    //Validar si los campos estan vacios

    //Retorna true si al menos un campo esta vacio
    const camposVacios = [mesa,hora].some( campo => campo === '' );

    if(camposVacios){
        mostrarAlerta("Llenar TODOS los campos");
        return;
    }

    //Asignar valores al Objeto
    cliente = {...cliente, mesa,hora};

    //Ocultar Modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    //Mostrar secciones
    mostrarSecciones();

    //Optener platillos desde API JSON-SERVER
    obtenerPlatillos();
}

//Mostar alerta
function  mostrarAlerta(mensaje){

    //Validamos si la alarma ya existe
    const alertaExiste = document.querySelector('.invalid-feedback');

    if(!alertaExiste){
        const alerta = document.createElement('div');
        alerta.classList.add('invalid-feedback','d-block','text-center');
        alerta.textContent = mensaje;
    
        document.querySelector('.modal-body form').appendChild(alerta);
        setTimeout(()=>{
            alerta.remove();
        },3000);
    }
    
}

//Mostrar secciones
function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none');

    seccionesOcultas.forEach(seccion =>{
        seccion.classList.remove('d-none');
    })
}

//Consultamos Api
function obtenerPlatillos(){

    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(platillos => mostrarPlatillos(platillos))

}

//Mostramos HTML para mostrar platillos
function mostrarPlatillos(platillos){

    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach(platillo => {

        const row = document.createElement('div');
        row.classList.add('row','py-3','border-top');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-3','fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');
        inputCantidad.value = 0;

        //Funcion para detectar la cantidad y platillo agregado
        inputCantidad.onchange = function(){
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...platillo,cantidad});
        };

        const agregar = document.createElement('div');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);

        contenido.appendChild(row);

    })

}

function agregarPlatillo(objetoPlatillo){
    
    //Extraer pedido actual
    let {pedido} = cliente;

    //Revisar que la cantidad sea mayor a 0
    if(objetoPlatillo.cantidad > 0 ){

        //Verificamos si el producto agregado ya existe en el array
        if(pedido.some( articulo => articulo.id === objetoPlatillo.id)){
            //Hacemos un mapeo para aumentar la cantidad en el articulo que ya este agregado
            const pedidoActualizado = pedido.map( articulo => {
                if(articulo.id === objetoPlatillo.id){
                    articulo.cantidad = objetoPlatillo.cantidad;
                }
                return articulo;
            });
            pedido = [...pedidoActualizado];

        } else {
            //si el articulo aún no existe, lo agregamos al Array
            cliente.pedido = [...pedido, objetoPlatillo];
        }
        
    } else{
        //si la cantidad vuelve a 0 eliminamos ese pedido
        const resultado = pedido.filter( articulo => articulo.id !== objetoPlatillo.id);
        cliente.pedido = [...resultado];
    }

    //Limpiar HTML del resumen
    limpiarHTML();

    //Revisar si Pedido esta vacio
    if(cliente.pedido.length){
        //MOSTRAR EL RESUMEN EN EL HTML
        actualizarResumen();
    } else{
        mensajePedidoVacio();
    }


}

function actualizarResumen(){

    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6','card','py-2','px-3','shadow');

    //Informacion de la mesa
    const mesa = document.createElement('p');
    mesa.textContent = "Mesa: ";
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');
    
    //Informacion de la hora
    const hora = document.createElement('p');
    hora.textContent = "Hora: ";
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    //Agregar a los elementos padre
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //Titulo de Seccion
    const heading = document.createElement('h3');
    heading.textContent = "Platillos Consumidos";
    heading.classList.add('my-4','text-center');

    //Iterar sobre el array de Pedidos
    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');

    const {pedido} =cliente;
    pedido.forEach(articulo => {
        const {nombre,cantidad,precio,id} = articulo;

        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        const nombreEl = document.createElement('h4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        //Cantidad del articulo
        const cantidadEl = document.createElement('p');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;
        
        //Precio del articulo
        const precioEl = document.createElement('p');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';

        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;
        
        //Precio del articulo
        const subtotalEl = document.createElement('p');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: ';

        const SubtotalValor = document.createElement('span');
        SubtotalValor.classList.add('fw-normal');
        SubtotalValor.textContent = `$${precio*cantidad}`;

        //Boton para eleminar articulo
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn','btn-danger');
        btnEliminar.textContent = "Eliminar Pedido";

        btnEliminar.onclick = function(){
            eliminarPedido(id);
        }

        //Agregar valores a sus contenedores
        cantidadEl.appendChild(cantidadValor);
        precioEl.appendChild(precioValor);
        subtotalEl.appendChild(SubtotalValor);

        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);

        grupo.appendChild(lista);
    })

    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    //Mostrar Formulario de propinas
    formularioPropinas();
}

function limpiarHTML(){
    const contenido = document.querySelector('#resumen .contenido');

    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }
}

//Eliminar pedido
function eliminarPedido(id){

    const {pedido} = cliente;

    const resultado = pedido.filter(articulo => articulo.id !== id);
    cliente.pedido = [...resultado];
    limpiarHTML();

    if(cliente.pedido.length){

        actualizarResumen();
    }else{
        mensajePedidoVacio();
    }

    //El pproducto se eliminó, entonces regresamos la cantidad a 0
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;

}

function mensajePedidoVacio(){
    const contenido = document.querySelector('#resumen .contenido');

    const text = document.createElement('p');
    text.classList.add('text-center');
    text.textContent = "Añade elementos del pedido";

    contenido.appendChild(text);
}

function formularioPropinas(){

    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6','formulario');

    const divFormulario = document.createElement('div');
    divFormulario.classList.add('card','py-2','px-3','shadow')

    const heading = document.createElement('h3');
    heading.classList.add('my-4','text-center');
    heading.textContent = 'Propina';

    //Agregar Radio Button
    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = "10";
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('label');
    radio10Label.textContent = "10%";
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('div');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    //Radio 25%
    const radio25 = document.createElement('input');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = "25";
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement('label');
    radio25Label.textContent = "25%";
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('div');
    radio25Div.classList.add('form-check');

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);


    //Agregar al formulario
    formulario.appendChild(divFormulario);
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);

    contenido.appendChild(formulario);

}

function calcularPropina(){
    const {pedido} = cliente;
    let subtotal = 0;

    pedido.forEach(articulo => {
        subtotal += articulo.precio *articulo.cantidad;
    });

    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;
    const propina = (subtotal*parseInt(propinaSeleccionada))/100;
    let total = subtotal + propina;
    
    mostrarTotalHTML(subtotal,total,propina);

}

function mostrarTotalHTML(subtotal,total,propina){

    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar');

    //SubTotal
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-4','fw-bold','mt-2');
    subtotalParrafo.textContent = 'Subtotal consumo: ';

    const subtotalSpan = document.createElement('span');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`;

    //Propina
    const propinaParrafo = document.createElement('p');
    propinaParrafo.classList.add('fs-4','fw-bold','mt-2');
    propinaParrafo.textContent = 'Propina consumo: ';

    const propinaSpan = document.createElement('span');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$${propina}`;

    //Total
    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fs-4','fw-bold','mt-2');
    totalParrafo.textContent = 'Total consumo: ';

    const totalSpan = document.createElement('span');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${total}`;

    //eliminar el ultimo resultado
    const totalPagarDiv = document.querySelector('.total-pagar');
    if(totalPagarDiv){
        totalPagarDiv.remove();
    }

    subtotalParrafo.appendChild(subtotalSpan);
    propinaParrafo.appendChild(propinaSpan);
    totalParrafo.appendChild(totalSpan);

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales);

}