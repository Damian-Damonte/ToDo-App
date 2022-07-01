const errores = {
    nombre: "El nombre debe contener al menos 5 carateres",
    apellido: "El apellido debe contener al menos 5 carateres",
    email: "Email invalido",
    contrasenia: "La contraseña debe contener al menos 5 carateres",
    contraseniaRepe: "Las contraseñas no coinciden"
};
let contenedorErrores = [];
/* ---------------------------------- texto --------------------------------- */
function validarTexto(texto) {
    return (texto.length > 4)
}

function normalizarTexto(texto) {
    return texto.toLowerCase().trim();
}

/* ---------------------------------- email --------------------------------- */
function validarEmail(email) {
    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

    let resultado = regex.test(email);
    return resultado;
}

function normalizarEmail(email) {
    return email.toLowerCase().trim();
}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(contrasenia) {
    let resultado = (contrasenia.length > 4 ) || false;
    return resultado;
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
    return (contrasenia_1 === contrasenia_2);
}

/* -------------------------------- validar todo -------------------------------- */

function validarTodo (nombre, apellido, email, contrasenia, repeContrasenia) {
    contenedorErrores.length = 0;
    validarTexto(nombre) ? "" : contenedorErrores.push(errores.nombre);
    validarTexto(apellido) ? "" : contenedorErrores.push(errores.apellido);
    validarEmail(email) ? "" : contenedorErrores.push(errores.email);
    validarContrasenia(contrasenia) ? "" : contenedorErrores.push(errores.contrasenia);
    compararContrasenias(contrasenia, repeContrasenia) ? "" : contenedorErrores.push(errores.contraseniaRepe);
};


/* -------------------------------- renderizar Errores -------------------------------- */
function renderizarErrores (array){
    divErrores.innerHTML = "";
    divErrores.innerHTML = array.map(error =>`<li class="errorItem">${error}</li>`).join("");
}