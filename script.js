// Objeto global para almacenar los valores de compra/venta de las divisas
let cotizacionesGuardadas = {};

async function cargarCotizaciones() {
    const grid = document.getElementById('divisas-grid');
    grid.innerHTML = '<p class="loading">Cargando cotizaciones actualizadas...</p>';

    try {
        // 1. Peticiones API
        const resDolar = await fetch('https://dolarapi.com/v1/dolares/oficial');
        const dolar = await resDolar.json();

        const resEuro = await fetch('https://dolarapi.com/v1/cotizaciones/eur');
        const euro = await resEuro.json();

        const resReal = await fetch('https://dolarapi.com/v1/cotizaciones/brl');
        const real = await resReal.json();

        const resGlobal = await fetch('https://open.er-api.com/v6/latest/ARS');
        const datosGlobal = await resGlobal.json();
        const tasas = datosGlobal.rates;

        const yuanValor = (1 / tasas.CNY).toFixed(2);
        const nairaValor = (1 / tasas.NGN).toFixed(2);

        // Guardar valores de venta como referencia para conversión
        cotizacionesGuardadas = {
            'USD': parseFloat(dolar.venta),
            'EUR': parseFloat(euro.venta),
            'BRL': parseFloat(real.venta),
            'CNY': parseFloat(yuanValor),
            'NGN': parseFloat(nairaValor)
        };

        const tarjetas = [
            { id: 'USD', nombre: 'Dólar Oficial (USD)', compra: dolar.compra, venta: dolar.venta },
            { id: 'EUR', nombre: 'Euro (EUR)', compra: euro.compra, venta: euro.venta },
            { id: 'BRL', nombre: 'Real Brasileño (BRL)', compra: real.compra, venta: real.venta },
            { id: 'CNY', nombre: 'Yuan Chino (CNY)', compra: yuanValor, venta: yuanValor },
            { id: 'NGN', nombre: 'Naira Nigeriana (NGN)', compra: nairaValor, venta: nairaValor }
        ];

        grid.innerHTML = '';
        const selectDestino = document.getElementById('select-destino');
        selectDestino.innerHTML = '';

        tarjetas.forEach(item => {
            // Crear tarjeta visual
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

            // Al hacer clic en la tarjeta, seleccionar esta moneda en la calculadora
            card.addEventListener('click', () => {
                selectDestino.value = item.id;
                destacarTarjeta(card);
                calcularConversion();
            });

            grid.appendChild(card);

            // Poblar dropdown de destino
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.nombre;
            selectDestino.appendChild(option);
        });

        // Eventos para la calculadora en tiempo real
        document.getElementById('input-monto').addEventListener('input', calcularConversion);
        selectDestino.addEventListener('change', () => {
            const selectedCode = selectDestino.value;
            const card = document.querySelector(`.card[data-code="${selectedCode}"]`);
            if (card) destacarTarjeta(card);
            calcularConversion();
        });

        // Cálculo inicial
        calcularConversion();

    } catch (error) {
        grid.innerHTML = `<p class="loading">Error al cargar las cotizaciones: ${error.message}</p>`;
    }
}

function calcularConversion() {
    const monto = parseFloat(document.getElementById('input-monto').value) || 0;
    const destino = document.getElementById('select-destino').value;
    const precioVenta = cotizacionesGuardadas[destino];

    if (precioVenta && precioVenta > 0) {
        const resultado = (monto / precioVenta).toFixed(2);
        document.getElementById('input-resultado').value = `${resultado} ${destino}`;
    } else {
        document.getElementById('input-resultado').value = '0.00';
    }
}

function destacarTarjeta(cardElement) {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');
}

cargarCotizaciones();