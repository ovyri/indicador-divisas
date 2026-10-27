// Objeto global para almacenar tasas relativas al ARS
let tasasGlobales = {};

async function cargarCotizaciones() {
    const grid = document.getElementById('divisas-grid');
    grid.innerHTML = '<p class="loading">Cargando cotizaciones actualizadas...</p>';

    try {
        // 1. Peticiones API oficiales
        const resDolar = await fetch('https://dolarapi.com/v1/dolares/oficial');
        const dolar = await resDolar.json();

        const resEuro = await fetch('https://dolarapi.com/v1/cotizaciones/eur');
        const euro = await resEuro.json();

        const resReal = await fetch('https://dolarapi.com/v1/cotizaciones/brl');
        const real = await resReal.json();

        // Tasas globales basadas en ARS desde ExchangeRate-API
        const resGlobal = await fetch('https://open.er-api.com/v6/latest/ARS');
        const datosGlobal = await resGlobal.json();
        const tasas = datosGlobal.rates;

        // Valores de venta calculados en ARS por unidad de divisa extranjera
        const dolarVenta = parseFloat(dolar.venta);
        const euroVenta = parseFloat(euro.venta);
        const realVenta = parseFloat(real.venta);
        const yuanVenta = (1 / tasas.CNY);
        const nairaVenta = (1 / tasas.NGN);
        const libraVenta = (1 / tasas.GBP);
        const yenVenta = (1 / tasas.JPY);

        // Guardar en objeto base (valor en ARS de 1 unidad de cada divisa)
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
            { id: 'ARS', nombre: 'Peso Argentino (ARS)', compra: '1.00', venta: '1.00' },
            { id: 'USD', nombre: 'Dólar Oficial (USD)', compra: dolar.compra, venta: dolarVenta.toFixed(2) },
            { id: 'EUR', nombre: 'Euro (EUR)', compra: euro.compra, venta: euroVenta.toFixed(2) },
            { id: 'BRL', nombre: 'Real Brasileño (BRL)', compra: real.compra, venta: realVenta.toFixed(2) },
            { id: 'CNY', nombre: 'Yuan Chino (CNY)', compra: yuanVenta.toFixed(2), venta: yuanVenta.toFixed(2) },
            { id: 'NGN', nombre: 'Naira Nigeriana (NGN)', compra: nairaVenta.toFixed(2), venta: nairaVenta.toFixed(2) },
            { id: 'GBP', nombre: 'Libra Esterlina (GBP)', compra: libraVenta.toFixed(2), venta: libraVenta.toFixed(2) },
            { id: 'JPY', nombre: 'Yen Japonés (JPY)', compra: yenVenta.toFixed(2), venta: yenVenta.toFixed(2) }
        ];

        grid.innerHTML = '';
        const selectOrigen = document.getElementById('select-origen');
        const selectDestino = document.getElementById('select-destino');
        
        selectOrigen.innerHTML = '';
        selectDestino.innerHTML = '';

        const opcionesMonedas = [
            { code: 'ARS', nombre: 'Peso Argentino (ARS)' },
            { code: 'USD', nombre: 'Dólar (USD)' },
            { code: 'EUR', nombre: 'Euro (EUR)' },
            { code: 'BRL', nombre: 'Real (BRL)' },
            { code: 'CNY', nombre: 'Yuan (CNY)' },
            { code: 'NGN', nombre: 'Naira (NGN)' },
            { code: 'GBP', nombre: 'Libra (GBP)' },
            { code: 'JPY', nombre: 'Yen (JPY)' }
        ];

        opcionesMonedas.forEach(op => {
            selectOrigen.appendChild(new Option(op.nombre, op.code));
            selectDestino.appendChild(new Option(op.nombre, op.code));
        });

        // Valores por defecto preseleccionados
        selectOrigen.value = 'ARS';
        selectDestino.value = 'USD';

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

            // Clic en la tarjeta lleva la moneda al destino del conversor
            card.addEventListener('click', () => {
                selectDestino.value = item.id;
                destacarTarjeta(card);
                calcularConversion();
            });

            grid.appendChild(card);
        });

        // Eventos del conversor
        document.getElementById('input-monto').addEventListener('input', calcularConversion);
        selectOrigen.addEventListener('change', calcularConversion);
        selectDestino.addEventListener('change', () => {
            const card = document.querySelector(`.card[data-code="${selectDestino.value}"]`);
            if (card) destacarTarjeta(card);
            calcularConversion();
        });

        calcularConversion();

    } catch (error) {
        grid.innerHTML = `<p class="loading">Error al cargar las cotizaciones: ${error.message}</p>`;
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