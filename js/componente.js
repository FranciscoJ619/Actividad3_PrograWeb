class PuzzleJS {
    constructor(opciones) {
        this.imagen = opciones.imagen;
        this.filas = opciones.filas || 3;
        this.columnas = opciones.columnas || 3;

        this.piezas = [];
        this.posicionVacia = this.filas * this.columnas - 1;

        this.crearTablero();
    }
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

        const tablero = document.createElement("div");
        tablero.id = "tableroPuzzle";
        tablero.style.gridTemplateColumns = `repeat(${this.columnas}, 100px)`;
        tablero.style.gridTemplateRows = `repeat(${this.filas}, 100px)`;
        tablero.style.width = `${this.columnas * 100}px`;
        tablero.style.height = `${this.filas * 100}px`;

        contenedor.appendChild(botonCerrar);
        contenedor.appendChild(tablero);

        modal.appendChild(contenedor);
        document.body.appendChild(modal);
        this.crearPiezas(tablero);
        this.mezclarPiezas();
    }
    crearPiezas(tablero) {
        const totalPiezas = this.filas * this.columnas;

        for (let i = 0; i < totalPiezas; i++) {
            const pieza = document.createElement("div");

            const fila = Math.floor(i / this.columnas);
            const columna = i % this.columnas;

            pieza.style.backgroundImage = `url("${this.imagen}")`;
            pieza.style.backgroundSize = `${this.columnas * 100}px ${this.filas * 100}px`;
            pieza.style.backgroundPosition = `-${columna * 100}px -${fila * 100}px`;
            pieza.dataset.posicion = i;

            if (i === totalPiezas - 1) {
                pieza.style.backgroundImage = "none";
                pieza.style.backgroundColor = "#11b126";
                pieza.dataset.vacio = "true";
            }
            pieza.addEventListener("click", () => {
                const posicionActual = this.piezas.indexOf(pieza);
                this.moverPieza(posicionActual);
            });

            this.piezas.push(pieza);
            tablero.appendChild(pieza);
        }
    }
    mezclarPiezas() {
        for (let i = 0; i < 100; i++) {
            const movimientos = this.obtenerMovimientosPosibles();
            const movimientoAleatorio =
                movimientos[
                    Math.floor(Math.random() * movimientos.length)
                ];
            this.intercambiarPiezas( movimientoAleatorio, this.posicionVacia);
        }
        this.actualizarTablero();
    }
    obtenerMovimientosPosibles() {
        const movimientos = [];
        const fila = Math.floor(this.posicionVacia / this.columnas);
        const columna = this.posicionVacia % this.columnas;

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
    moverPieza(posicion) {
        const movimientos = this.obtenerMovimientosPosibles();
        if (movimientos.includes(posicion)) {
            this.intercambiarPiezas(posicion,this.posicionVacia);
            this.actualizarTablero();
            this.comprobarVictoria();
        }
    }
    comprobarVictoria() {
        for (let i = 0; i < this.piezas.length; i++) {
            if (this.piezas[i].dataset.posicion != i) {
                return;
            }
        }
        alert("¡Puzzle completado!");
    }
    intercambiarPiezas(posicion1, posicion2) {
        const temporal = this.piezas[posicion1];
        this.piezas[posicion1] = this.piezas[posicion2];

        this.piezas[posicion2] = temporal;

        this.posicionVacia = posicion1;
    }
    actualizarTablero() {
        const tablero = document.getElementById("tableroPuzzle");
        tablero.innerHTML = "";
        this.piezas.forEach(pieza => {
            tablero.appendChild(pieza);
        });
    }
}
const botonFacil = document.getElementById("btnFacil");
const botonMedio = document.getElementById("btnMedio");
const botonDificil = document.getElementById("btnDificil");

botonFacil.addEventListener("click", function() {
    new PuzzleJS({
        imagen: "img/periodico.png",
        filas: 3,
        columnas: 3
    });
});
botonMedio.addEventListener("click", function() {
    new PuzzleJS({
        imagen: "img/jolouNait.png",
        filas: 4,
        columnas: 4
    });
});
botonDificil.addEventListener("click", function() {
    new PuzzleJS({
        imagen: "img/koku.png",
        filas: 5,
        columnas: 5
    });
});