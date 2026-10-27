async function cargarCotizaciones() {
    const grid = document.getElementById('dolares-grid');
    try {
        const respuesta = await fetch('https://dolarapi.com/v1/dolares');
        const datos = await respuesta.json();

        grid.innerHTML = '';

        datos.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>Dólar ${item.nombre}</h3>
                <div class="values">
                    <div class="val-box">
                        <span class="label">Compra</span>
                        <span class="amount">$${item.compra}</span>
                    </div>
                    <div class="val-box">
                        <span class="label">Venta</span>
                        <span class="amount">$${item.venta}</span>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        grid.innerHTML = `<p class="loading">Error al cargar las cotizaciones: ${error.message}</p>`;
    }
}

cargarCotizaciones();