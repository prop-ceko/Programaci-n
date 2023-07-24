import abc

from rest_framework import viewsets
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet

import reservas.api.serializers as serializers
import reservas.models as models


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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return models.Reserva.objects.filter(solicitante=user)


class ReservaEquipamientoViewSet(viewsets.ModelViewSet):
    queryset = models.ReservaEquipamiento.objects.all()
    serializer_class = serializers.ReservaEquipamientoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return models.ReservaEquipamiento.objects.filter(reserva__solicitante=user)
