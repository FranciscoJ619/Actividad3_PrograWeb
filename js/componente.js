//Creamos una clase donde se va a crear todo el rompecabezas desde 0
class PuzzleJS {
    //Metodo contructor donde se delimita la imagen, las filas y columnas, en caso de que
    //no se especifiquen filas y columnas, se delimitan por defecto a 3 cada una
    constructor(opciones) {
        this.imagen = opciones.imagen;
        this.filas = opciones.filas || 3;
        this.columnas = opciones.columnas || 3;

        this.piezas = [];
        this.posicionVacia = this.filas * this.columnas - 1;

        this.crearTablero();
    }
    //Metodo para crear el modal, su contenedor y el componente llamado tablero con una opcion para 
    //cerrar la ventana emergente creada, y la funcion para cerrarla como event listener
    crearTablero() {
        const modalAnterior = document.getElementById("modalPuzzle");
        if (modalAnterior) {
            modalAnterior.remove();
        }
        const modal = document.createElement("div");

        modal.id = "modalPuzzle";
        modal.className = "modalPuzzle";

        const contenedor = document.createElement("div");
        contenedor.className = "contenedorPuzzle";

        const botonCerrar = document.createElement("button");
        botonCerrar.textContent = "✕";
        botonCerrar.className = "botonCerrar";
        botonCerrar.addEventListener("click", function() {
            modal.remove();
        });

        //Metodo de creacion del tablero para crear una cuadricula con partes de la imagen de manera dinamica
        const tablero = document.createElement("div");
        tablero.id = "tableroPuzzle";
        //Recibe la cantidad de filas y columnas para cortar la imagen
        tablero.style.gridTemplateColumns = `repeat(${this.columnas}, 100px)`;
        tablero.style.gridTemplateRows = `repeat(${this.filas}, 100px)`;
        tablero.style.width = `${this.columnas * 100}px`;
        tablero.style.height = `${this.filas * 100}px`;
        //Se le da el tablero y el boton de cerrar al contenedor
        contenedor.appendChild(botonCerrar);
        contenedor.appendChild(tablero);

        modal.appendChild(contenedor);
        document.body.appendChild(modal);
        //Metodos para crear y mezclar las piezas
        this.crearPiezas(tablero);
        this.mezclarPiezas();
    }
    //Funcion para cortar la imagen de manera uniforme dependiendo del numero de filas y columnas
    crearPiezas(tablero) {
        const totalPiezas = this.filas * this.columnas;
        //Ciclo para obtener todas las piezas
        for (let i = 0; i < totalPiezas; i++) {
            const pieza = document.createElement("div");
            //Divisiones necesarias
            const fila = Math.floor(i / this.columnas);
            const columna = i % this.columnas;
            //Se le da la imagen recortada de la imagen completa a cada pieza una por una
            pieza.style.backgroundImage = `url("${this.imagen}")`;
            pieza.style.backgroundSize = `${this.columnas * 100}px ${this.filas * 100}px`;
            pieza.style.backgroundPosition = `-${columna * 100}px -${fila * 100}px`;
            pieza.dataset.posicion = i;
            //Se le da color verde a la unica pieza vacia
            if (i === totalPiezas - 1) {
                pieza.style.backgroundImage = "none";
                pieza.style.backgroundColor = "#11b126";
                pieza.dataset.vacio = "true";
            }
            //Listener para mover piezas cuando sean presionadas
            pieza.addEventListener("click", () => {
                const posicionActual = this.piezas.indexOf(pieza);
                this.moverPieza(posicionActual);
            });
            //Se almacenan las piezas y se ponen dentro del tablero
            this.piezas.push(pieza);
            tablero.appendChild(pieza);
        }
    }
    //Funcion para mezclar piezas
    mezclarPiezas() {
        //Ciclo para hacer movimientos de piezas aleatorios un total de 100 veces para asegurar que se revuelva
        for (let i = 0; i < 100; i++) {
            const movimientos = this.obtenerMovimientosPosibles();
            const movimientoAleatorio =
                movimientos[
                    Math.floor(Math.random() * movimientos.length)
                ];
            this.intercambiarPiezas( movimientoAleatorio, this.posicionVacia);
        }
        //Metodo para actualizar el tablero cuando se termina de mezclar las piezas
        this.actualizarTablero();
    }
    //Funcion para regresar los movimientos que una pieza puede realizar para evitar movimientos ilegales
    obtenerMovimientosPosibles() {
        const movimientos = [];
        const fila = Math.floor(this.posicionVacia / this.columnas);
        const columna = this.posicionVacia % this.columnas;
        //Condicionales para checar que no se pueda salir del tablera usando el total de filas y columnas
        if (fila > 0) {
            movimientos.push(this.posicionVacia - this.columnas);
        }
        if (fila < this.filas - 1) {
            movimientos.push(this.posicionVacia + this.columnas);
        }
        if (columna > 0) {
            movimientos.push(this.posicionVacia - 1);
        }
        if (columna < this.columnas - 1) {
            movimientos.push(this.posicionVacia + 1);
        }
        return movimientos;
    }
    //Funcion para utilizar la posicion de la pieza presionada para mover la pieza posible
    moverPieza(posicion) {
        const movimientos = this.obtenerMovimientosPosibles();
        //Se debe de verificar que la pieza presionada se pueda mover
        if (movimientos.includes(posicion)) {
            this.intercambiarPiezas(posicion,this.posicionVacia);
            this.actualizarTablero();
            this.comprobarVictoria();
        }
    }
    //Metodo para revisar despues de cada movimiento valido si se ha completado la imagen correctamente
    comprobarVictoria() {
        //Ciclo para buscar piezas fuera de su orden, en caso de que no este completo no regresa nada
        for (let i = 0; i < this.piezas.length; i++) {
            if (this.piezas[i].dataset.posicion != i) {
                return;
            }
        }
        //Cuando se completa la imagen Se añade la frase de felicidades y un boton para cerrar de nuevo la ventana
        const contenedor = document.querySelector(".contenedorPuzzle");
        const mensaje = document.createElement("h2");
        mensaje.textContent = "¡Felicidades! Puzzle completado";
        const boton = document.createElement("button");
        boton.textContent = "Elegir otra dificultad";
        //Boton para cambiar dificultad (Cerrar la ventana)
        boton.addEventListener("click", function() {
            const modal = document.getElementById("modalPuzzle");
            modal.remove();
        });
        contenedor.appendChild(mensaje);
        contenedor.appendChild(boton);
    }
    //Metodo necesario para almacenar la pieza seleccionada para cambiarla por la posicion de la pieza vacia 
    //y volver a colocar ahora la pieza almacenada (Mucho texto para solo el metodo de cambiar piezas de posicion)
    intercambiarPiezas(posicion1, posicion2) {
        const temporal = this.piezas[posicion1];
        this.piezas[posicion1] = this.piezas[posicion2];
        this.piezas[posicion2] = temporal;
        this.posicionVacia = posicion1;
    }
    //Funcion para mostrar los cambios que se han hecho al tablero pieza por pieza
    actualizarTablero() {
        const tablero = document.getElementById("tableroPuzzle");
        tablero.innerHTML = "";
        this.piezas.forEach(pieza => {
            tablero.appendChild(pieza);
        });
    }
}
//Declaraciones de variables para los botones de seleccion de dificultad
const botonFacil = document.getElementById("btnFacil");
const botonMedio = document.getElementById("btnMedio");
const botonDificil = document.getElementById("btnDificil");
//Cuando se presione un boton, el que sea, se selecciona la imagen del rompecabezas y sus filas y columnas
botonFacil.addEventListener("click", function() {
    iniciarCarga();
    //Se instancia el rompecabezas con filas y columnas prediseñadas
    new PuzzleJS({
        imagen: "img/periodico.png",
        filas: 3,
        columnas: 3
    });
});
botonMedio.addEventListener("click", function() {
    iniciarCarga();
    new PuzzleJS({
        imagen: "img/jolouNait.png",
        filas: 4,
        columnas: 4
    });
});
botonDificil.addEventListener("click", function() {
    iniciarCarga();
    new PuzzleJS({
        imagen: "img/koku.png",
        filas: 5,
        columnas: 5
    });
});
//Funcion solo necesaria para la prueba del componente en el index
//----------------------------------------------------------------------------------------------------------
//---------------------!!!!NO ES NECESARIA PARA LA CORRECTA UTILIZACION DEL COMPONENTE!!!!------------------
//----------------------------------------------------------------------------------------------------------
function iniciarCarga() {
    const progreso = document.getElementById("progreso");
    const textoCarga = document.getElementById("textoCarga");

    let porcentaje = 0;
    const intervalo =
        setInterval(function() {
            porcentaje++;
            progreso.style.width = porcentaje + "%";
            textoCarga.textContent = porcentaje + "%";
            if (porcentaje >= 100) {
                clearInterval(intervalo);
            }
        }, 50);
}