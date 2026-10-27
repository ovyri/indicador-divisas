import urllib.request
import json

def consultar_divisas():
    print("==================================================")
    print("         🌍 INDICADOR GLOBAL DE DIVISAS          ")
    print("==================================================")
    print("Consultando cotizaciones en tiempo real...\n")

    try:
        url_dolar = "https://dolarapi.com/v1/dolares/oficial"
        req_dolar = urllib.request.Request(url_dolar, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req_dolar) as response:
            dolar = json.loads(response.read().decode())

        url_euro = "https://dolarapi.com/v1/cotizaciones/eur"
        req_euro = urllib.request.Request(url_euro, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req_euro) as response:
            euro = json.loads(response.read().decode())

        url_real = "https://dolarapi.com/v1/cotizaciones/brl"
        req_real = urllib.request.Request(url_real, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req_real) as response:
            real = json.loads(response.read().decode())

        url_global = "https://open.er-api.com/v6/latest/ARS"
        req_global = urllib.request.Request(url_global, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req_global) as response:
            datos_global = json.loads(response.read().decode())
        
        tasas = datos_global['rates']

        yuan = 1 / tasas.get('CNY', 1)
        naira = 1 / tasas.get('NGN', 1)
        libra = 1 / tasas.get('GBP', 1)
        yen = 1 / tasas.get('JPY', 1)

        print(f"💵 Dólar Oficial  -> Compra: ${dolar.get('compra')} | Venta: ${dolar.get('venta')}")
        print(f"💶 Euro           -> Compra: ${euro.get('compra')} | Venta: ${euro.get('venta')}")
        print(f"🇧🇷 Real Brasileño -> Compra: ${real.get('compra')} | Venta: ${real.get('venta')}")
        print(f"🇨🇳 Yuan Chino     -> Valor aprox: ${yuan:.2f} ARS")
        print(f"🇳🇬 Naira Nigeriana-> Valor aprox: ${naira:.2f} ARS")
        print(f"🇬🇧 Libra Esterlina-> Valor aprox: ${libra:.2f} ARS")
        print(f"🇯🇵 Yen Japonés    -> Valor aprox: ${yen:.2f} ARS")
        print("==================================================")

    except Exception as e:
        print(f"❌ Error al conectar con las APIs: {e}")

if __name__ == "__main__":
    consultar_divisas()