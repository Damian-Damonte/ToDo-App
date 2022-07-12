localStorage.getItem('jwt') && location.replace('/mis-tareas.html');

window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.querySelector('form');
    const inputEmail = document.querySelector('#inputEmail');
    const inputPassword = document.querySelector('#inputPassword');
    const divErrores = document.getElementById("divErrores");

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const usuario = {
            email: inputEmail.value,
            password: inputPassword.value
        };
        camposVacios(usuario.email, usuario.password) ? divErrores.innerHTML = campoVacio : realizarLogin(usuario);
    });

    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    async function realizarLogin(user) {
        mostrarSpinner();
        const data = await superFetch(`${ENDPOINT}/users/login`, settingsFetch("POST", null, user));
        data.jwt ? loginExitiso(data) : divErrores.innerHTML = loginErrores(data);
    };
});
