from django.urls import path, include
from rest_framework import routers

from reservas.api import views

router = routers.DefaultRouter()
router.register(r'aulas', views.AulaViewSet)
router.register(r'establecimientos', views.EstablecimientoViewSet)
router.register(r'equipamiento', views.EquipamientoDisponibleViewSet)
router.register(r'reservas', views.ReservaViewSet)
router.register(r'reservase', views.ReservaEquipamientoViewSet)
router.register(r'login', views.LoginViewSet, basename="login")
router.register(r'logout', views.LogoutViewSet, basename="logout")

urlpatterns = [
    path('', include(router.urls)),
]
