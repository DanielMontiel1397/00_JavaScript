document.addEventListener('DOMContentLoaded',function(){

    //OBJETO
    const email = {
        email: '',
        asunto: '',
        mensaje: ''
    }
    
    //SELECTORES
    const formulario = document.querySelector('#formulario');
    const inputEmail = document.querySelector('#email');
    const inputAsunto = document.querySelector('#asunto');
    const inputMensaje = document.querySelector('#mensaje');
    const inputCC = document.querySelector('#cc');
    const btnEnviarEmail = document.querySelector('#formulario button[type="submit"]');
    const btnResetearFormulario = document.querySelector('#formulario button[type="reset"]');
    const spinner = document.querySelector('#spinner');
    
    //EVENT LISTENERS

    /*"blur" se ejecuta cuando abandonas un campo */
    inputEmail.addEventListener('input',validarCampo);
    inputAsunto.addEventListener('input',validarCampo);
    inputMensaje.addEventListener('input',validarCampo);
    inputCC.addEventListener('input',validarCampo);

    formulario.addEventListener('submit',enviarEmail);

    btnResetearFormulario.addEventListener('click',function(e){
        e.preventDefault();
        
        //Reiniciar el objeto
        reiniciarFormulario();
    })

    //FUNCIONES
    function validarCampo(e){

        /*"trim" elimina los espacios vacios al principio y al final */
        if(e.target.value.trim() === '' && e.target.name !== 'cc'){
            mensajeAlerta(`El campo ${e.target.name} es obligatorio`,e.target.parentElement);
            email[e.target.name] = '';
            comprobarEmail();
            return;
        }

        //Validamos si el campo email se ingreso correctamente
        if(e.target.id==='email' && !validarEmail(e.target.value)){
            mensajeAlerta('El email no es válido',e.target.parentElement);
            email[e.target.name] = '';
            comprobarEmail();
            return; 
        }
        
        /*Ya que el campo "cc" no es obligatorio, si tiene contenido
        validamos si el email es correcto */
        if(e.target.id==='cc' && !validarEmail(e.target.value) && e.target.value.trim()!==''){
            mensajeAlerta('El email no es válido',e.target.parentElement);
            email[e.target.name] = '';
            console.log(email);
            comprobarEmail();
            return;
        }

        /*Si el espacio esta vacio eliminamos "cc" del objeto
        para que aún asi podamos enviar el formulario */
        if(e.target.id==='cc' && e.target.value.trim() ===''){
            limpiarAlerta(e.target.parentElement);
            delete email.cc;
            comprobarEmail();
            return;
        }
            

        limpiarAlerta(e.target.parentElement);
        
        //Asignar valores
        email[e.target.name] = e.target.value.trim().toLowerCase();
        

        //Comprobar el objeto Email
        comprobarEmail();
    }

    function mensajeAlerta(mensaje,input){

        limpiarAlerta(input);

        //Generar alerta en HTML
        const error = document.createElement('P');
        error.textContent = mensaje;
        error.classList.add('bg-red-600','text-white','p-2','text-center');
        input.appendChild(error); 
    }

    function limpiarAlerta(input){
        const error = input.querySelector('.bg-red-600');
        if(error){
            error.remove();
        }
    }

    function validarEmail(email){
        //Expresión regular, busca un patrón en una cadena de texto
        const regex =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ 
        const resultado = regex.test(email);
        return resultado;
    }

    function comprobarEmail(){
        if(Object.values(email).includes('')){
            btnEnviarEmail.classList.add('opacity-50');
            btnEnviarEmail.disabled = true;
            return;
        } 

        btnEnviarEmail.classList.remove('opacity-50');
        btnEnviarEmail.disabled = false;
        
    }

    function enviarEmail(e){
        e.preventDefault();
        spinner.classList.add('flex');
        spinner.classList.remove('hidden');

        setTimeout(()=>{
            spinner.classList.remove('flex');
            spinner.classList.add('hidden');

            //Reiniciar el objeto
            reiniciarFormulario();

            //Crear una alerta
            const alertaExito = document.createElement('p');
            alertaExito.classList.add('bg-green-500','text-white','p-2','text-center','rounded-lg','mt-10','font-bold','text-sm','uppercase');
            alertaExito.textContent = 'Mensaje enviado correctamente';
            formulario.appendChild(alertaExito);

            setTimeout(() => {
                alertaExito.remove();
            }, 3000);

        },3000);
        console.log(emailEnviados);
    }

    function reiniciarFormulario(){
        email.email = '';
        email.asunto = '';
        email.mensaje = '';
        delete email.cc; //Eliminamos la propiedad "cc" al reiniciar o enviar el formulario
        formulario.reset();
        comprobarEmail();
    }

});