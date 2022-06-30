window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = this.document.querySelector("form");
    const inputNombre = this.document.getElementById("inputNombre");
    const inputApellido = this.document.getElementById("inputApellido");
    const inputEmail = this.document.getElementById("inputEmail");
    const inputPassword = this.document.getElementById("inputPassword");
    const inputPasswordRepetida = this.document.getElementById("inputPasswordRepetida");
    const divErrores = this.document.getElementById("divErrores");
    const listaErrores = this.document.getElementById("listaErrores");

    

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
        
        event.preventDefault();
        const usuario = {
            firstName: normalizarTexto(inputNombre.value),
            lastName: normalizarTexto(inputApellido.value),
            email: normalizarEmail(inputEmail.value),
            password: normalizarTexto(inputPassword.value) 
        };

        console.log(usuario);

        validarTodo(usuario.firstName, usuario.lastName, usuario.email, usuario.password, inputPasswordRepetida.value);

        contenedorErrores.length === 0 ? realizarRegister(usuario) : renderizarErrores(contenedorErrores);

    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(user) {
        const url = 'https://ctd-todo-api.herokuapp.com/v1/users';

        const configuraciones = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        };

        fetch(url, configuraciones)
        .then( respuesta => respuesta.json())
        .then( data => {
            console.log('RESPUESTA DEL SERVIDOR');
            console.log(data)
            
        if (data.jwt){
            localStorage.setItem('jwt', data.jwt)
            location.replace('/mis-tareas.html')
            }
        })


    };


});