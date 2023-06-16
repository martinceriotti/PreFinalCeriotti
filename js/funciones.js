class Receta {
    constructor(id, nombre, titulo, ingredientes, preparacion, precio) {
        this.id = id;
        this.nombre = nombre;
        this.titulo = titulo;
        this.preparacion = preparacion;
        this.ingredientes = ingredientes;
        this.anulado = 0;
        this.precio = precio
    }
    anularReceta() {
        this.anulado = 1;
    }
}

function editarOEliminarReceta(e) {
    var arregloLocal = recuperarRecetaLS();
    if (e.target.dataset.action == 'edit') {
        /* FUNCION DE EDICION
        CARGA DE DATOS
        GUARDAR
        */
        let recuperar = mostrarRecetaEdicion(arregloLocal, e);
        Toastify({
            text: `Receta ${recuperar[0].nombre} recuperada para editar.`,
            gravity: "top",
            position: 'right',
            style: {
                background: '#94013D'
            }
        }).showToast();
    } else if (e.target.dataset.action === 'delete') {
        try {
            recetaBorrar = document.getElementById(`li-${e.target.dataset.id}`);
            recetaBorrar.remove();
            let borrada = arregloLocal.filter(function (receta) { return receta.id == e.target.dataset.id });
            arregloLocal = arregloLocal.filter(function (receta) { return receta.id != e.target.dataset.id });
            actualizarRecetaLS(arregloLocal);
            Toastify({
                text: `Receta de ${borrada[0].nombre} borrada.`,
                gravity: "top",
                position: 'right',
                style: {
                    background: '#94013D'
                }
            }).showToast();
            listarRecetas();
        } catch (error) {
            console.log(error);
        }
    }
    
}

function listarRecetas() {
    borrarCampos();
    let arregloLocal = []
    arregloLocal = recuperarRecetaLS()
    let listaRecetas = document.getElementById("listaRecetas");
    listaRecetas.remove();

    let contenedorListaRecetas = document.getElementById("contenedorListaRecetas");
    listaRecetas = document.createElement("ul");
    listaRecetas.className = "list-group mb-3";
    listaRecetas.id = "listaRecetas";

    contenedorListaRecetas.append(listaRecetas);

    let acumulador = 0;
    let contador = arregloLocal.length;
    document.getElementById("id").value = arregloLocal.length ? arregloLocal.length : 1;
    listaRecetas.addEventListener('click', (e) => editarOEliminarReceta(e));

    for (const recetas of arregloLocal) {
        let recetax = document.createElement("li");
        recetax.id = "li-" + recetas.id;
        recetax.className = 'list-group-item d-flex justify-content-between lh-sm';
        recetax.innerHTML = `
                <div>
                    <h6 class="my-0">${recetas.titulo}</h6>
                    <small class="text-muted">${recetas.preparacion}</small>
                </div>
                <span class="d-flex p-2"> 
                <button data-id="${recetas.id}" id="edit-${recetas.id}" data-action="edit">Edit</button>
                <button data-id="${recetas.id}" id="delete-${recetas.id}" data-action="delete">Delete</button>
                </span>
                <span class="text-muted">$${recetas.precio}</span>`;
        acumulador += recetas.precio;
        listaRecetas.append(recetax);
    }
    let total = document.createElement('li');
    total.className = 'list-group-item d-flex justify-content-between';
    total.innerHTML = `<span>Total $</span>
                        <strong>$ ${acumulador}</strong>`
    listaRecetas.append(total);
    let pillTotal = document.getElementById("pillTotal");
    pillTotal.innerHTML = `${contador}`;
    deseleccionarArray();
}

function guardarRecetaFormulario(e) {

    e.preventDefault();

    let arregloLocal = recuperarRecetaLS();
    let id = arregloLocal.length + 1;
    let nombre = document.getElementById("nombre").value;
    let titulo = document.getElementById("titulo").value;
    let preparación = document.getElementById("preparación").value;
    let ingredientes = document.getElementById("ingredientes");
    let precio = Number(document.getElementById("precio").value);
    try {
        const recetaxy = new Receta(id, nombre, titulo, ingredientesArray(), preparación, precio);
        const auxobj = JSON.stringify(recetaxy);
        const auxparse = JSON.parse(auxobj);
        arregloLocal.push(auxparse);

        Toastify({
            text: `Receta de ${titulo} guardada.`,
            gravity: "top",
            position: 'right',
            style: {
                background: '#138535'
            }
        }).showToast();

    } catch (error) {
        console.log(error);
    }
    console.log(arregloLocal);
    actualizarRecetaLS(arregloLocal);
    listarRecetas();
}

function recuperarRecetaLS() {
    let arregloString = localStorage.getItem("arregloRecetas");
    try {
        var arreglo = JSON.parse(arregloString);
        return arreglo
    } catch (error) {
        console.log(error);
    }
}

function actualizarRecetaLS(arregloRecetas) {
    let arregloString = JSON.stringify(arregloRecetas);
    localStorage.setItem("arregloRecetas", arregloString);
}

function cargarIngredientes() {
    let ingr = document.getElementById("contenedorIngredientes");
    var cadenaIngredientes = `
    <label for="preparacion" class="form-label">Ingredientes</label>
    <div class="form-check" id="ingredientes"  >`;

    for (const ingrediente of ingredientes) {
        cadenaIngredientes += `
        <div class="form-check">
        <input class="form-check-input" type="checkbox"  value="${ingrediente}" id="flexCheckChecked${ingrediente}">
        <label class="form-check-label" for="flexCheckChecked">
            ${ingrediente}
        </label>
        </div>
        `
    }
    ingr.innerHTML = cadenaIngredientes;
    var checkbox = document.querySelectorAll(".form-check-input");
    for (const checki of checkbox) {
        if (checki.checked == true) {
            console.log(checki);
        } else {
            console.log(checki.value);
        }

    }
}

function ingredientesArray() {
    var arrayIngredientes = [];
    var checkbox = document.querySelectorAll(".form-check-input");
    for (const checki of checkbox) {
        if (checki.checked == true) {
            arrayIngredientes.push(checki.value)
        }
    }
    return (arrayIngredientes);
}

function deseleccionarArray() {
    var checkbox = document.querySelectorAll(".form-check-input");
    for (const checki of checkbox) {
        checki.checked = false;
    }
}

function mostrarRecetaEdicion(arregloLocal, e){
    let recuperar = arregloLocal.filter(function (receta) { return receta.id == e.target.dataset.id });
    let id = document.getElementById("id") ;
    id.value = recuperar[0].id;
    let nombre = document.getElementById("nombre") ;
    nombre.value = recuperar[0].nombre;
    let titulo = document.getElementById("titulo") ;
    titulo.value = recuperar[0].titulo;
    let preparacion = document.getElementById("preparación") ;
    preparacion.innerHTML = recuperar[0].preparacion;
    let ingredientes = document.getElementById("ingredientes");
    //Ver
    for (const ingrediente of recuperar[0].ingredientes) {
        
        let chequeo = "flexCheckChecked"+ingrediente;
        checka = document.getElementById(chequeo)  ;
         
        console.log(checka);
    } 
    let precio = document.getElementById("precio");
    precio.value = recuperar[0].precio;
    return recuperar;
}

function borrarCampos( ){
    
    let id = document.getElementById("id") ;
    id.value = 0
    let nombre = document.getElementById("nombre") ;
    nombre.value = "";
    let titulo = document.getElementById("titulo") ;
    titulo.value = "";
    let preparacion = document.getElementById("preparación") ;
    preparacion.innerHTML = "";
    let ingredientes = document.getElementById("ingredientes");
    //Ver
    
    let precio = document.getElementById("precio");
    precio.value = 0;
    
}