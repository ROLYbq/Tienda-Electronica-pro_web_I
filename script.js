document.addEventListener('DOMContentLoaded', () => {
    const hamburguesa = document.getElementById('hamburguesa');
    const navLinks = document.getElementById('nav-links');
    
    // Menú hamburguesa
    hamburguesa.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    // Contenedores flotantes para carrito y comparación
    const carritoContainer = document.createElement('div');
    carritoContainer.id = 'carrito-container';
    document.body.appendChild(carritoContainer);

    const comparacionContainer = document.createElement('div');
    comparacionContainer.id = 'comparacion-container';
    document.body.appendChild(comparacionContainer);

    // Mostrar/Ocultar carrito y comparación (toggle)
    window.toggleCarrito = function() {
        carritoContainer.style.display = carritoContainer.style.display === 'block' ? 'none' : 'block';
        comparacionContainer.style.display = 'none';
    };

    window.toggleComparacion = function() {
        comparacionContainer.style.display = comparacionContainer.style.display === 'block' ? 'none' : 'block';
        carritoContainer.style.display = 'none';
    };

    // Manejo de productos en carrito y comparación
    const guardarLocalStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));
    const obtenerLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];

    // Función para mostrar lista en contenedor (carrito o comparación)
    function mostrarLista(container, key) {
        const productos = obtenerLocalStorage(key);
        container.innerHTML = `<h3>${key === 'carrito' ? 'Carrito' : 'Comparación'}</h3>`;
        if (productos.length === 0) {
            container.innerHTML += `<p>No hay productos.</p>`;
            return;
        }
        const ul = document.createElement('ul');
        ul.id = key + '-list';
        productos.forEach(prod => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${prod.nombre}</strong><br>Precio: Bs ${prod.precio.toFixed(2)}`;
            ul.appendChild(li);
        });
        container.appendChild(ul);

        if (key === 'carrito') {
            const acciones = document.createElement('div');
            acciones.id = 'carrito-actions';
            acciones.innerHTML = `
                <button onclick="vaciarCarrito()">Vaciar Carrito</button>
                <button onclick="irCompra()">Comprar</button>
            `;
            container.appendChild(acciones);
        }
    }

    // Mostrar listas iniciales
    mostrarLista(carritoContainer, 'carrito');
    mostrarLista(comparacionContainer, 'comparacion');

    // Función para vaciar carrito
    window.vaciarCarrito = function() {
        localStorage.removeItem('carrito');
        mostrarLista(carritoContainer, 'carrito');
    };

    // Función para ir a compra
    window.irCompra = function() {
        // Solo deja ir a compra si hay productos
        const carrito = obtenerLocalStorage('carrito');
        if (carrito.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }
        window.location.href = 'compra.html';
    };

    // Función para agregar producto
    window.agregarProducto = function(tipo, producto) {
        // tipo: 'carrito' o 'comparacion'
        const lista = obtenerLocalStorage(tipo);
        // Evitar duplicados
        if (lista.find(p => p.id === producto.id)) {
            alert('Este producto ya está en ' + (tipo === 'carrito' ? 'el carrito' : 'la comparación'));
            return;
        }
        lista.push(producto);
        guardarLocalStorage(tipo, lista);
        if (tipo === 'carrito') mostrarLista(carritoContainer, 'carrito');
        else mostrarLista(comparacionContainer, 'comparacion');
    };
});