// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
const JWT = localStorage.getItem('jwt') || location.replace('/');


 /* ----------------------------------  Loader ---------------------------------------- */
const body = this.document.querySelector("body");
const todo = this.document.querySelectorAll("header, main, footer");
const loader = this.document.querySelector(".spinner")

// todo.forEach(elemento=>{
//   elemento.classList.toggle("disabled")
// });

// body.classList.toggle("bodyCentrado")

// this.setTimeout(function () {
//   loader.classList.toggle("disabled");
//   body.classList.toggle("bodyCentrado");
//   todo.forEach(elemento=>{
//     elemento.classList.toggle("disabled")
//   });
// },2000)




/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {

  /* ---------------- variables globales y llamado a funciones ---------------- */
  const btnCerrarSesion = this.document.querySelector('#closeApp');
  const nombreUsuario = this.document.querySelector('.user-info p');
  const contenedorTareasPendientes = this.document.querySelector('.tareas-pendientes');
  const contenedorTareasTerminadas = this.document.querySelector('.tareas-terminadas');
  const formCrearTarea = this.document.querySelector('form.nueva-tarea');
  const nuevaTarea = this.document.getElementById("nuevaTarea");



// boton hamburguesa

const menuHamburguesa = this.document.getElementById("menu"),
      btnHamburguesa = this.document.querySelector(".icono-menu");

btnHamburguesa.addEventListener("click", ()=>{
  menuHamburguesa.classList.toggle("active");
})



  const ENDPOINT = "https://ctd-todo-api.herokuapp.com/v1";

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */
  btnCerrarSesion.addEventListener('click', () => {
    localStorage.clear();
    location.replace('/');
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  (function obtenerNombreUsuario() {
    const configuraciones = {
      method: 'GET',
      headers: {
        authorization: JWT
      }
    }

    fetch(`${ENDPOINT}/users/getMe`, configuraciones)
    .then(respueta => respueta.json())
    .then(data => nombreUsuario.textContent = data.firstName)
  })();

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    const configuraciones = {
      method: 'GET',
      headers: {
        authorization: JWT
      }
    };

    fetch(`${ENDPOINT}/tasks`, configuraciones)
      .then(respueta => respueta.json())
      .then(data => renderizarTareas(data))
  };
  consultarTareas();

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', function (event) {
  event.preventDefault();

  const payLoad = {
    description : nuevaTarea.value
  }

  const configuraciones = {
    method: 'POST',
    headers: {
      authorization: JWT,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payLoad)
  }

  fetch(`${ENDPOINT}/tasks`, configuraciones)
    .then(respueta => respueta.json())
    .then(data => {
      consultarTareas()
      this.reset()});
  });

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {

    // filtramos  y ordenamos las terminadas
    const listadoTareasPendientes = listado.filter( item => !item.completed).sort((a,b)=> a.id - b.id );
    const listadoTareasTerminadas = listado.filter( item => item.completed).sort((a,b)=> a.id - b.id);

    contenedorTareasPendientes.innerHTML = listadoTareasPendientes.map(tarea=>
      `
        <li class="tarea" data-aos="fade-down">
          <button class="change" data-idtarea="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
          <div class="descripcion">
            <p class="nombre">${tarea.description}</p>
            <p class="timestamp">${new Date(tarea.createdAt).toLocaleString()}</p>
          </div>
        </li>
      `).join("");

    contenedorTareasTerminadas.innerHTML = listadoTareasTerminadas.map(tarea=>
      `
        <li class="tarea" data-aos="fade-up">
          <div class="hecha">
            <i class="fa-regular fa-circle-check"></i>
          </div>
          <div class="descripcion">
            <p class="nombre">${tarea.description}</p>
            <div class="cambios-estados">
              <button class="change completa" data-idtarea="${tarea.id}"><i class="fa-solid fa-rotate-left"></i></button>
              <button class="borrar" data-idtarea="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
            </div>
          </div>
        </li>
      `).join("");

    const botonesChange = document.querySelectorAll('.change');
    const botonesDelete = document.querySelectorAll('.borrar');
    const cantidadPendientes = document.getElementById("cantidad-pendientes");
    const cantidadFinalizadas = document.getElementById("cantidad-finalizadas");

    //contador tareas pendientes
    cantidadPendientes.textContent = listadoTareasPendientes.length;

    //contador tareas finalizadas
    cantidadFinalizadas.textContent = listadoTareasTerminadas.length;

    // recorremos lo botones de CAMBIAR para agregarle la escucha del click
    botonesChange.forEach( boton => {
      boton.addEventListener('click', evento => {
        botonesCambioEstado(evento.target)
      })
    });
    
    // recorremos lo botones de BORRAR para agregarle la escucha del click
    botonesDelete.forEach( boton => {
      boton.addEventListener('click', evento => {
        botonBorrarTarea(evento.target)
      })
    })
  };

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado(nodo) {

    const terminada = nodo.classList.contains('completa');

    // preparamos el objeto a enviar al servidor
    // siempre invertimos el valor de terminada segun el boton que dispara el click
    const cambio = {
      completed: !terminada
    }

    const configuraciones = {
      method:'PUT',
      headers: {
        authorization: JWT,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cambio)
    }

    fetch(`${ENDPOINT}/tasks/${nodo.dataset.idtarea}`, configuraciones)
    .then( respuesta => respuesta.json())
    .then( info => consultarTareas())
  };

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  
  function botonBorrarTarea(nodo) {
    
    const configuraciones = {
      method:'DELETE',
      headers: {
        authorization: JWT,
        'Content-Type': 'application/json',
      }
    };

    fetch(`${ENDPOINT}/tasks/${nodo.dataset.idtarea}`, configuraciones)
    .then( respuesta => respuesta.json())
    .then( info => consultarTareas())
  };
});
