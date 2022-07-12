const errores = {
    nombre: "El nombre debe contener al menos 5 carateres",
    apellido: "El apellido debe contener al menos 5 carateres",
    email: "Email invalido",
    contrasenia: "La contraseña debe contener al menos 5 carateres",
    contraseniaRepe: "Las contraseñas no coinciden"
};
let contenedorErrores = [];

const ENDPOINT = "https://ctd-fe2-todo.herokuapp.com/v1";
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

/* -------------------------------- campos vacios -------------------------------- */
const campoVacio = `<p class="errorItem">Los campos no pueden estar vacios</p>`;
function camposVacios (email, contrasenia) {
    return (email === "" || contrasenia === "") ;
}

/* -------------------------------- login exitoso -------------------------------- */

function loginExitiso (data) {
    localStorage.setItem('jwt', data.jwt);
    location.replace('/mis-tareas.html');
}

/* -------------------------------- login errores -------------------------------- */
function loginErrores (data) {
    ocultarSpinner();
    return `<p class="errorItem">${data}</p>`;
};

/* -------------------------------- validar todo signup -------------------------------- */

function validarTodo (nombre, apellido, email, contrasenia, repeContrasenia) {
    contenedorErrores.length = 0;
    validarTexto(nombre, apellido) ? "" : contenedorErrores.push(errores.nombre);
    validarTexto(apellido) ? "" : contenedorErrores.push(errores.apellido);
    validarEmail(email) ? "" : contenedorErrores.push(errores.email);
    validarContrasenia(contrasenia) ? "" : contenedorErrores.push(errores.contrasenia);
    compararContrasenias(contrasenia, repeContrasenia) ? "" : contenedorErrores.push(errores.contraseniaRepe);

};

/* -------------------------------- renderizar Errores -------------------------------- */
function renderizarErrores (){
    return contenedorErrores.map(error =>`<li class="errorItem">${error}</li>`).join("");
};

/* -------------------------------- configuraciones Fetch -------------------------------- */
function settingsFetch (metodo, jwt, payLoad) {

    if (jwt === null && payLoad !== null){
        return {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payLoad)
        };
    };

    if (jwt !== null && payLoad === null) {
        return {
            method: metodo,
            headers: {
                authorization: jwt
            },
        };
    };

    if (jwt !== null && payLoad !== null) {
        return {
            method: metodo,
            headers: {
                authorization: jwt,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payLoad)
        };
    };
};

/* -------------------------------- super fetch -------------------------------- */

async function superFetch (url, configuracion) {
    const respuesta = await fetch(url, configuracion);
    const data = await respuesta.json();
    return data;
};

/* -------------------------------- renderizar tareas pendientes -------------------------------- */

function renderizarPendientes (listado) {
    return listado.map(({id, description, createdAt}) => `  
            <li class="tarea" data-aos="fade-down">
                <button class="change" data-idtarea="${id}"><i class="fa-regular fa-circle"></i></button>
                <div class="descripcion">
                    <p class="nombre">${description}</p>
                    <p class="timestamp">${new Date(createdAt).toLocaleString()}</p>
                </div>
            </li>
        `).join("");
};

/* -------------------------------- renderizar tareas terminadas -------------------------------- */

function renderizarTerminadas (listado) {
    return listado.map(({id, description})=>`
        <li class="tarea" data-aos="fade-up">
            <div class="hecha">
                <i class="fa-regular fa-circle-check"></i>
            </div>
            <div class="descripcion">
                <p class="nombre">${description}</p>
                <div class="cambios-estados">
                    <button class="change completa" data-idtarea="${id}"><i class="fa-solid fa-rotate-left"></i></button>
                    <button class="borrar" data-idtarea="${id}"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </div>
        </li>
        `).join("");
};

/* -------------------------------- funcionalidad botones tareas -------------------------------- */

function funcionalidadBtns (funcionChange, funcionDelete) {
    const botonesChange = document.querySelectorAll('.change');
    const botonesDelete = document.querySelectorAll('.borrar');
    

    botonesChange.forEach( boton => {
        boton.addEventListener('click', evento => {
            funcionChange(evento.target)
        })
    });

    botonesDelete.forEach( boton => {
        boton.addEventListener('click', evento => {
            funcionDelete(evento.target)
        })
    });
};

/* -------------------------------- contador tareas -------------------------------- */
function contadorTareas (listadoTareasPendientes, listadoTareasTerminadas) {
    const cantidadPendientes = document.getElementById("cantidad-pendientes");
    const cantidadFinalizadas = document.getElementById("cantidad-finalizadas");
    cantidadPendientes.textContent = listadoTareasPendientes.length;
    cantidadFinalizadas.textContent = listadoTareasTerminadas.length;
};