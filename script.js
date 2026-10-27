async function cargarCotizaciones() {
    const grid = document.getElementById('divisas-grid');
    grid.innerHTML = '<p class="loading">Cargando cotizaciones actualizadas...</p>';

    try {
        // 1. Obtener Dólar, Euro y Real desde DolarAPI
        const resDolar = await fetch('https://dolarapi.com/v1/dolares/oficial');
        const dolar = await resDolar.json();

        const resEuro = await fetch('https://dolarapi.com/v1/cotizaciones/eur');
        const euro = await resEuro.json();

        const resReal = await fetch('https://dolarapi.com/v1/cotizaciones/brl');
        const real = await resReal.json();

        // 2. Obtener Yuan (CNY) y Naira (NGN) comparados con ARS desde open.er-api
        const resGlobal = await fetch('https://open.er-api.com/v6/latest/ARS');
        const datosGlobal = await resGlobal.json();
        const tasas = datosGlobal.rates;

        // Cálculo de ARS por unidad de divisa
        const yuanValor = (1 / tasas.CNY).toFixed(2);
        const nairaValor = (1 / tasas.NGN).toFixed(2);

        // Lista unificada de divisas a mostrar
        const tarjetas = [
            { nombre: 'Dólar Oficial (USD)', compra: dolar.compra, venta: dolar.venta },
            { nombre: 'Euro (EUR)', compra: euro.compra, venta: euro.venta },
            { nombre: 'Real Brasileño (BRL)', compra: real.compra, venta: real.venta },
            { nombre: 'Yuan Chino (CNY)', compra: yuanValor, venta: yuanValor },
            { nombre: 'Naira Nigeriana (NGN)', compra: nairaValor, venta: nairaValor }
        ];

        grid.innerHTML = '';

        tarjetas.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${item.nombre}</h3>
                <div class="values">
                    <div class="val-box">
                        <span class="label">Compra / Referencia</span>
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