import urllib.request
import json

def obtener_cotizaciones():
    url = "https://dolarapi.com/v1/dolares"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            datos = json.loads(response.read().decode())
            print("==========================================")
            print("     COTIZACIÓN DEL DÓLAR EN ARGENTINA    ")
            print("==========================================")
            for item in datos:
                nombre = item.get("nombre")
                compra = item.get("compra")
                venta = item.get("venta")
                print(f"{nombre:15} | Compra: ${compra:<8} | Venta: ${venta}")
            print("==========================================")
    except Exception as e:
        print(f"Error al obtener los datos: {e}")

if __name__ == "__main__":
    obtener_cotizaciones()