function mostrarSpinner() {

    const btnSubmit = document.querySelector("form button");
    const spinner = document.querySelector(".spinner");
    const ingresar = document.querySelector("#ingresar");

    spinner.classList.toggle("disabled");
    ingresar.classList.toggle("disabled");

    btnSubmit.setAttribute("disabled","")
    btnSubmit.style.cursor="no-drop";
    
};

function ocultarSpinner() {

    const btnSubmit = document.querySelector("form button");
    const spinner = document.querySelector(".spinner");
    const ingresar = document.querySelector("#ingresar");

    spinner.classList.toggle("disabled");
    ingresar.classList.toggle("disabled");

    btnSubmit.removeAttribute("disabled");
    btnSubmit.style.cursor="pointer";
};

function renderizarSkeletons(cantidad, contenedor) {

    const contenedorTareas = document.querySelector(contenedor);

    let contador = 0;
    while (contador < cantidad) {
        const template = `
    <li class="skeleton-container ${contenedor.replace(".", "")}-child">
        <div class="skeleton-card">
        <p class="skeleton-text"></p>
        <p class="skeleton-text"></p>
        </div>
    </li>
    `;
    
    contenedorTareas.innerHTML += template;
    contador++;
    };
};