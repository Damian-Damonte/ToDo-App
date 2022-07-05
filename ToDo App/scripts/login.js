// evaluar si hay un token para mandarlo directo a sus tareas
// const jwt = localStorage.getItem('jwt');
// if (jwt) {
//     location.replace('/mis-tareas.html');
// }

localStorage.getItem('jwt') && location.replace('/mis-tareas.html');


window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.querySelector('form');
    const inputEmail = document.querySelector('#inputEmail');
    const inputPassword = document.querySelector('#inputPassword');
    const divErrores = this.document.getElementById("divErrores");

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const usuario = {
            email: inputEmail.value,
            password: inputPassword.value
        };
        realizarLogin(usuario)
    });

    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(user) {
        fetch(`${ENDPOINT}/users/login`, configuracionesPost(user))
        .then( respuesta => respuesta.json())
        .then( data => data.jwt ? loginExitiso(data) :  divErrores.innerHTML = loginErrores(data, inputEmail.value, inputPassword.value))
    };
});
