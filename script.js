let tasasGlobales = {};

async function cargarCotizaciones() {
    const grid = document.getElementById('divisas-grid');
    grid.innerHTML = '<p class="loading">Cargando cotizaciones en tiempo real...</p>';

    try {
        const resDolar = await fetch('https://dolarapi.com/v1/dolares/oficial');
        const dolar = await resDolar.json();

        const resEuro = await fetch('https://dolarapi.com/v1/cotizaciones/eur');
        const euro = await resEuro.json();

        const resReal = await fetch('https://dolarapi.com/v1/cotizaciones/brl');
        const real = await resReal.json();

        const resGlobal = await fetch('https://open.er-api.com/v6/latest/ARS');
        const datosGlobal = await resGlobal.json();
        const tasas = datosGlobal.rates;

        const dolarVenta = parseFloat(dolar.venta);
        const euroVenta = parseFloat(euro.venta);
        const realVenta = parseFloat(real.venta);
        const yuanVenta = (1 / tasas.CNY);
        const nairaVenta = (1 / tasas.NGN);
        const libraVenta = (1 / tasas.GBP);
        const yenVenta = (1 / tasas.JPY);

        tasasGlobales = {
            'ARS': 1,
            'USD': dolarVenta,
            'EUR': euroVenta,
            'BRL': realVenta,
            'CNY': yuanVenta,
            'NGN': nairaVenta,
            'GBP': libraVenta,
            'JPY': yenVenta
        };

        const tarjetas = [
            { id: 'USD', nombre: 'Dólar Oficial (USD)', compra: dolar.compra, venta: dolarVenta.toFixed(2) },
            { id: 'EUR', nombre: 'Euro (EUR)', compra: euro.compra, venta: euroVenta.toFixed(2) },
            { id: 'BRL', nombre: 'Real Brasileño (BRL)', compra: real.compra, venta: realVenta.toFixed(2) },
            { id: 'CNY', nombre: 'Yuan Chino (CNY)', compra: yuanVenta.toFixed(2), venta: yuanVenta.toFixed(2) },
            { id: 'NGN', nombre: 'Naira Nigeriana (NGN)', compra: nairaVenta.toFixed(2), venta: nairaVenta.toFixed(2) },
            { id: 'GBP', nombre: 'Libra Esterlina (GBP)', compra: libraVenta.toFixed(2), venta: libraVenta.toFixed(2) },
            { id: 'JPY', nombre: 'Yen Japonés (JPY)', compra: yenVenta.toFixed(2), venta: yenVenta.toFixed(2) }
        ];

        grid.innerHTML = '';

        tarjetas.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.code = item.id;
            card.innerHTML = `
                <h3>${item.nombre}</h3>
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

            card.addEventListener('click', () => {
                document.getElementById('select-destino').value = item.id;
                destacarTarjeta(card);
                calcularConversion();
            });

            grid.appendChild(card);
        });

        document.getElementById('input-monto').addEventListener('input', calcularConversion);
        document.getElementById('select-origen').addEventListener('change', calcularConversion);
        document.getElementById('select-destino').addEventListener('change', () => {
            const selectedCode = document.getElementById('select-destino').value;
            const card = document.querySelector(`.card[data-code="${selectedCode}"]`);
            if (card) destacarTarjeta(card);
            calcularConversion();
        });

        calcularConversion();

    } catch (error) {
        grid.innerHTML = `<p class="loading">Error al cargar cotizaciones: ${error.message}</p>`;
    }
}

function calcularConversion() {
    const monto = parseFloat(document.getElementById('input-monto').value) || 0;
    const origen = document.getElementById('select-origen').value;
    const destino = document.getElementById('select-destino').value;

    const valorOrigenEnARS = tasasGlobales[origen];
    const valorDestinoEnARS = tasasGlobales[destino];

    if (valorOrigenEnARS && valorDestinoEnARS) {
        const enPesos = monto * valorOrigenEnARS;
        const resultado = enPesos / valorDestinoEnARS;
        document.getElementById('input-resultado').value = `${resultado.toFixed(2)} ${destino}`;
    } else {
        document.getElementById('input-resultado').value = '0.00';
    }
}

function destacarTarjeta(cardElement) {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');
}

cargarCotizaciones();