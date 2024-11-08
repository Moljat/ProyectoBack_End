from django.urls import path
from . import consumidores

trotamundos_patrones = [
    path('ws/chat/',consumidores.Consumidores.as_asgi())
]
