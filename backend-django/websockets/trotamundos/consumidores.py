#Requerimeinto del websocket:
#1.Capacidad de conexcion
#2. capacidad de desconexion
#3. Tranferencia de datos para

import json
from channels.generic.websocket import WebsocketConsumer  

class Consumidores(WebsocketConsumer):
    # Mantiene un conjunto de clientes conectados
    clientes = set()

    # Método que se ejecuta cuando un cliente se conecta
    def connect(self):
        """
        Este método se ejecuta cuando un cliente establece una conexión WebSocket.
        Añade el cliente actual al conjunto de clientes conectados.
        
        - El WebSocket se agrega al conjunto `clientes` para poder enviarle mensajes más tarde.
        """
        # Añadir el cliente actual al conjunto de clientes conectados
        self.clientes.add(self)
        self.accept()

    # Método que se ejecuta cuando un cliente se desconecta
    def disconnect(self, close_code):
        """
        Este método se ejecuta cuando un cliente cierra la conexión WebSocket.
        El cliente se elimina del conjunto de clientes conectados.
        
        - El WebSocket del cliente se elimina de la lista de clientes para que no reciba más mensajes.
        """
        # Eliminar el cliente del conjunto de clientes conectados
        self.clientes.remove(self)
    
    # Método que maneja la recepción de datos desde el cliente
    def receive(self, text_data):
        """
        Este método maneja los mensajes entrantes de los clientes.
        Los mensajes se esperan en formato JSON y deben contener un campo 'mensaje'.
        El mensaje recibido se distribuye a todos los clientes conectados.
        
        Parámetros:
            datos (str): Mensaje recibido en formato JSON desde el cliente.
        
        - El método deserializa el mensaje recibido y lo distribuye a todos los clientes conectados.
        """
        try:
            # Convertir el string JSON a un diccionario
            datos_json = json.loads(text_data)
            
            # Verificar si el mensaje está presente en el JSON
            mensaje = datos_json.get("mensaje", None)
            
            if mensaje is None:
                self.send(text_data=json.dumps({
                    'error': 'El campo "mensaje" no se encuentra en el JSON recibido.'
                }))
                return

            # Recorrer todos los clientes conectados y enviarles el mensaje
            for cliente in self.clientes:
                cliente.send(
                    # Enviar el mensaje de forma serializada en formato JSON
                    text_data=json.dumps({"mensaje": mensaje})
                )
        except json.JSONDecodeError:
            self.send(text_data=json.dumps({
                'error': 'Error al decodificar el mensaje JSON.'
            }))
        except Exception as e:
            self.send(text_data=json.dumps({
                'error': f'Ocurrió un error: {str(e)}'
            }))
