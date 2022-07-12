window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = this.document.querySelector("form");
    const inputNombre = this.document.getElementById("inputNombre");
    const inputApellido = this.document.getElementById("inputApellido");
    const inputEmail = this.document.getElementById("inputEmail");
    const inputPassword = this.document.getElementById("inputPassword");
    const inputPasswordRepetida = this.document.getElementById("inputPasswordRepetida");
    const divErroes = this.document.getElementById("divErrores");

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

        validarTodo(usuario.firstName, usuario.lastName, usuario.email, usuario.password, inputPasswordRepetida.value);
        contenedorErrores.length === 0 ? realizarRegister(usuario) : divErroes.innerHTML = renderizarErrores();
    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */

    async function realizarRegister(user) {
        mostrarSpinner();
        const data = await superFetch(`${ENDPOINT}/users`, settingsFetch("POST", null, user))
        data.jwt ? loginExitiso(data) : divErroes.innerHTML = loginErrores(data, inputEmail.value, inputPassword.value);
    };
});