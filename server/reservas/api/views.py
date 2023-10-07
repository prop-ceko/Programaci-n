from django.utils import timezone
from django.contrib.auth.signals import user_logged_in, user_logged_out
from knox.auth import TokenAuthentication

from knox.models import AuthToken
from knox.settings import knox_settings
from knox.views import LoginView as KnoxLoginView, LogoutView as KnoxLogoutView

from rest_framework import status
from rest_framework import viewsets
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.serializers import DateTimeField
from rest_framework.viewsets import GenericViewSet, ViewSet

import reservas.api.serializers as serializers
import reservas.models as models
from reservas.authentication import BasicAuthentication


class LoginViewSet(CreateModelMixin, GenericViewSet):
    authentication_classes = [BasicAuthentication]
    permission_classes = [AllowAny]
    serializer_class = serializers.LoginSerializer

    knox = KnoxLoginView()

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return self.knox.post(request, *args, **kwargs)


class LogoutViewSet(CreateModelMixin, ViewSet):
    authentication_classes = [TokenAuthentication]
    knox = KnoxLogoutView()

    def create(self, request, *args, **kwargs):
        return self.knox.post(request, *args, **kwargs)


class ReadOnlyViewSet(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    pass


class AulaViewSet(ReadOnlyViewSet):
    queryset = models.Aula.objects.all()
    serializer_class = serializers.AulaSerializer


class EstablecimientoViewSet(ReadOnlyViewSet):
    queryset = models.Establecimiento.objects.all()
    serializer_class = serializers.EstablecimientoSerializer


class EquipamientoAulaViewSet(ReadOnlyViewSet):
    queryset = models.EquipamientoAula.objects.all()
    serializer_class = serializers.EquipamientoAulaSerializer


class EquipamientoDisponibleViewSet(ReadOnlyViewSet):
    queryset = models.Equipamiento.objects.all()
    serializer_class = serializers.EquipamientoSerializer


class ReservaViewSet(viewsets.ModelViewSet):
    queryset = models.Reserva.objects.all()
    serializer_class = serializers.ReservaSerializer

    def get_queryset(self):
        user = self.request.user
        return models.Reserva.objects.filter(solicitante=user)


class ReservaEquipamientoViewSet(viewsets.ModelViewSet):
    queryset = models.ReservaEquipamiento.objects.all()
    serializer_class = serializers.ReservaEquipamientoSerializer

    def get_queryset(self):
        user = self.request.user
        return models.ReservaEquipamiento.objects.filter(reserva__solicitante=user)
