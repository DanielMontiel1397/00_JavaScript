function iniciarApp(){

    //Selectores
    const selectCategorias = document.querySelector('#categorias');

    if(selectCategorias){
        selectCategorias.addEventListener('change',seleccionarCategoria);

        //Obtener categorias
        obtenerCategorias();
    }

    const resultado = document.querySelector('#resultado');
    const modal = new bootstrap.Modal('#modal',{});

    const favoritosDiv= document.querySelector('.favoritos');
    if(favoritosDiv){
        obtenerFavoritos();
    }

    function obtenerCategorias(){
        const url = "https://www.themealdb.com/api/json/v1/1/categories.php";

        fetch(url)
            .then(resultado => resultado.json())
            .then(categorias => mostrarCategorias(categorias.categories));
    }

    //Mostrar Categorias en el Select
    function mostrarCategorias(categorias = []){
        categorias.forEach(categoria => {
            
            const opcion = document.createElement('option');
            opcion.textContent = categoria.strCategory;
            opcion.value = categoria.strCategory;
            selectCategorias.appendChild(opcion);
        }) 
    }


    //Mostrar recetas de la categoria seleccionada
    function seleccionarCategoria(e){
        const categoria = e.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;

        fetch(url)
            .then(resultado => resultado.json())
            .then(datos => mostrarRecetas(datos.meals))
    }

    //Mostrar Recetas a partir de select seleccionado
    function mostrarRecetas(recetas = []){

        limpiarHTML(resultado);

        const heading = document.createElement('h2');
        heading.classList.add('text-center','text-black','my-');
        heading.textContent = recetas.length ? 'Resultados' : 'No hay resultados';
        resultado.appendChild(heading);

        //Iterar resultados
        recetas.forEach(receta =>{
            const {idMeal,strMeal,strMealThumb} = receta;

            const recetaContainer = document.createElement('div');
            recetaContainer.classList.add('col-md-4');

            const card = document.createElement('div');
            card.classList.add('card','mb-4');

            const recetaImagen = document.createElement('img');
            recetaImagen.classList.add('card-img-top');
            recetaImagen.alt = `Imagen de la receta ${strMeal}`;
            recetaImagen.src = strMealThumb ?? receta.imagen;
            
            const recetaCardBody = document.createElement('div');
            recetaCardBody.classList.add('card-body');

            const recetaHeading = document.createElement('h3');
            recetaHeading.classList.add('card-title','mb-3');
            recetaHeading.textContent = strMeal ?? receta.titulo;

            const recetaBtn = document.createElement('button');
            recetaBtn.classList.add('btn','btn-danger','w-100');
            recetaBtn.textContent = `Ver Receta`;

            //Ver modal de cada receta
            /*recetaBtn.dataset.bsTarget = "#modal";
            recetaBtn.dataset.bsToggle = "modal";*/
            recetaBtn.onclick =  function(){
                seleccionarReceta(idMeal ?? receta.id);
            }

            //Agregar al código HTML
            recetaCardBody.appendChild(recetaHeading);
            recetaCardBody.appendChild(recetaBtn);

            card.appendChild(recetaImagen);
            card.appendChild(recetaCardBody);

            recetaContainer.appendChild(card);

            resultado.appendChild(recetaContainer);
        })

    }

    //Limpiamos el html de resultados de categoria para mostrar los nuevos resultados
    function limpiarHTML(selector){
        while(selector.firstChild){
            selector.removeChild(selector.firstChild);
        }
    }

    //Vemos la informacion de la receta que seleccionamos
    function seleccionarReceta(id){
        
        const idReceta = id;
        const url= `https://themealdb.com/api/json/v1/1/lookup.php?i=${idReceta}`;

        fetch(url)
            .then(resultado => resultado.json())
            .then(receta => mostrarRecetaModal(receta.meals[0]));

    }

    //Mostrar informacion en el Modal de la Receta
    function mostrarRecetaModal(receta){
        const {idMeal,strInstructions,strMeal,strMealThumb} = receta;

        const modalTitulo = document.querySelector('.modal .modal-title');
        const modalBody = document.querySelector('.modal .modal-body');

        modalTitulo.textContent = strMeal;
        modalBody.innerHTML = `
            <img class="img-fluid" src="${strMealThumb}" alt="receta ${strMeal}" >
            <h3 class="my-3">Instrucciones</h3>
            <p>${strInstructions}</p>
            <h3 class="my-3">Ingredientes y Cantidades</h3>
            `;

        const listGroup = document.createElement('ul');
        listGroup.classList.add('list-group');

        //Mostrar incredientes y cantidades
        for(let i=1; i<=20; i++){
            if(receta[`strIngredient${i}`]){
                const ingrediente = receta[`strIngredient${i}`];
                const cantidad = receta[`strMeasure${i}`];

                const ingredienteLi = document.createElement('li');
                ingredienteLi.classList.add('list-group-item');
                ingredienteLi.textContent = `${ingrediente} - ${cantidad}`;

                listGroup.appendChild(ingredienteLi);
            }
        }

        modalBody.appendChild(listGroup)

        //Botones cerrar y favorito
        const modalFooter = document.querySelector('.modal-footer');

        limpiarHTML(modalFooter);

        const btnFavorito = document.createElement('button');
        btnFavorito.classList.add('btn','btn-danger','col');
        btnFavorito.textContent = existeStorage(idMeal) ? "Eliminar Favorito" : "Guardar Favorito";

        const btnCerrarModal = document.createElement('button');
        btnCerrarModal.classList.add('btn','btn-secondary','col');
        btnCerrarModal.textContent = "Cerrar";
        btnCerrarModal.onclick = function(){
            modal.hide();
        }
        
        modalFooter.appendChild(btnFavorito);
        modalFooter.appendChild(btnCerrarModal);

        //Almacenar en LocalStorage
        btnFavorito.onclick = function(){

            if(!existeStorage(idMeal)){
                
                agregarFavorito({
                    id: idMeal,
                    titulo: strMeal,
                    imagen: strMealThumb
                });
                btnFavorito.textContent = "Eliminar Favorito";
                mostrarToast('Se agrego Correctamente');
            } else{
                eliminarFavorito(idMeal);
                btnFavorito.textContent = "Guardar Favorito";
                mostrarToast("Eliminado Correctamente");
                return;
            }

        }

        //Abrir el modal
        modal.show();
    }

    //Agregamos receta a liste de favoritos
    function agregarFavorito(receta){
        
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];

        localStorage.setItem('favoritos',JSON.stringify([...favoritos,receta]));

    }

    //comprobamos si la receta ya existe en el Local Storage
    function existeStorage(id){

        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        
        return favoritos.some(favorito => favorito.id === id);
    }

    //Eliminamos del Local Storage
    function eliminarFavorito(id){
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        const nuevosFavoritos = favoritos.filter(favorito => favorito.id !== id);
        localStorage.setItem('favoritos',JSON.stringify(nuevosFavoritos));
    }

    //Mostrar notificacion
    function mostrarToast(mensaje){
        const toastDiv = document.querySelector('#toast');
        const toastBody = document.querySelector('.toast-body');
        const toast = new bootstrap.Toast(toastDiv);

        toastBody.textContent = mensaje;

        toast.show();
    }

    //Mostrar lista de Favoritos
    function obtenerFavoritos(){
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];

        if(favoritos.length){

            mostrarRecetas(favoritos);

            return;
        }

        const noFavoritos = document.createElement('p');
        noFavoritos.textContent = "No hay favoritos aún";
        noFavoritos.classList.add('fs-4','text-centet','font-bold','mt-5');
        resultado.appendChild(noFavoritos);
    }
}

document.addEventListener('DOMContentLoaded',iniciarApp);