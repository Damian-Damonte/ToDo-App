const JWT = localStorage.getItem('jwt') || location.replace('/');
renderizarSkeletons(3, ".tareas-pendientes");
AOS.init();
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

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */
  btnCerrarSesion.addEventListener('click', async () => {
    // Swal.fire({
    //   title: 'Cerrar sesion',
    //   text: "¿Está seguro que quiere cerrar sesion?",
    //   icon: 'question',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Si, cerrar',
    //   cancelButtonText: 'Cancelar'
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     Swal.fire({
    //     title: 'Sesion cerrada',
    //     icon: 'success',
    //     showConfirmButton: false,
    //     });
    //     setTimeout(function(){
          // localStorage.clear();
          // location.replace('/');
    //       } ,1000)
    //     }
    //   })

    if ( await closeSesion()){
      console.log("cerrar");
    }
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  (async function obtenerNombreUsuario() {
    const data = await superFetch(`${ENDPOINT}/users/getMe`, settingsFetch("GET", JWT, null));
    nombreUsuario.textContent = data.firstName;
  })();

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  async function consultarTareas() {
    const data = await superFetch(`${ENDPOINT}/tasks`, settingsFetch("GET",JWT, null));
    renderizarTareas(data);
  };
  consultarTareas();

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', async function (event) {
    event.preventDefault();

    const payLoad = {
      description : nuevaTarea.value
    }

    await superFetch(`${ENDPOINT}/tasks`, settingsFetch("POST", JWT, payLoad));
    consultarTareas();
    this.reset();

    Swal.fire({
      icon: 'success',
      title: 'Tarea creada!',
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    })
  });

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {

    // filtramos  y ordenamos las tareas
    const listadoTareasPendientes = listado.filter( item => !item.completed).sort((a,b)=> a.id - b.id );
    const listadoTareasTerminadas = listado.filter( item => item.completed).sort((a,b)=> a.id - b.id);

    //renderizamos las tareas
    contenedorTareasPendientes.innerHTML = renderizarPendientes(listadoTareasPendientes)
    contenedorTareasTerminadas.innerHTML = renderizarTerminadas(listadoTareasTerminadas)
    
    contadorTareas(listadoTareasPendientes, listadoTareasTerminadas);

    funcionalidadBtns(botonesCambioEstado, botonBorrarTarea);
  };

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  async function botonesCambioEstado(nodo) {
    const terminada = nodo.classList.contains('completa');

    const payLoad = {
      completed: !terminada
    }

    await superFetch(`${ENDPOINT}/tasks/${nodo.dataset.idtarea}`, settingsFetch("PUT", JWT, payLoad));
    consultarTareas();
  };

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  async function botonBorrarTarea(nodo) {

      Swal.fire({
      title: 'Borrar tarea',
      text: "¿Está seguro que quiere borrar la tarea?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async(result) => {
      if (result.isConfirmed) {
        Swal.fire({
        title: 'Tarea borrada',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
        });
        await superFetch(`${ENDPOINT}/tasks/${nodo.dataset.idtarea}`, settingsFetch("DELETE", JWT, null));
        consultarTareas();
        }
      })
  };
});