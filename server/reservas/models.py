from datetime import datetime
from typing import Optional

from django.contrib.auth.models import User, Group, AbstractUser
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import UniqueConstraint
from django.utils.translation import gettext_lazy as _

from reservas.settings import MAX_LARGO_NOMBRES, MAX_LARGO_USUARIOS
from the_project import settings

# Create your models here.
Group.add_to_class('prioridad', models.PositiveIntegerField(default=0))


class Usuario(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)
    first_name = models.CharField(_("first name"), max_length=MAX_LARGO_NOMBRES)
    last_name = models.CharField(_("last name"), max_length=MAX_LARGO_NOMBRES)

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class Establecimiento(models.Model):
    nombre = models.CharField(max_length=MAX_LARGO_NOMBRES)
    direccion = models.CharField(max_length=100, verbose_name="dirección")

    def __str__(self):
        return self.nombre


class Edificio(models.Model):
    nombre = models.CharField(max_length=MAX_LARGO_NOMBRES)
    establecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.nombre} en {self.establecimiento}"


class Aula(models.Model):
    nombre = models.CharField(max_length=MAX_LARGO_NOMBRES)
    capacidad = models.PositiveIntegerField()
    establecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE, blank=True, null=True)
    edificio = models.ForeignKey(Edificio, on_delete=models.CASCADE, blank=True, null=True, default=None)
    es_laboratorio = models.BooleanField(default=False)

    def clean(self):
        if self.edificio is None and self.establecimiento is None:
            raise ValidationError("Establece edificio o establecimiento")
        if self.edificio is not None:
            self.establecimiento = self.edificio.establecimiento

    def disponible(self, ahora=False, fecha: Optional[datetime.date] = None,
                   desde: Optional[datetime.time] = None, hasta: Optional[datetime.time] = None):
        if ahora:
            ahora = datetime.now()
            fecha = ahora.date()
            desde = hasta = ahora.time()
        reservas_ahora = Reserva.objects.filter(aula=self, fecha=fecha, desde__lte=desde, hasta__gte=hasta)
        return reservas_ahora.first()

    def __str__(self):
        return f"{self.nombre} en {self.establecimiento}"

    class Meta:
        constraints = [
            UniqueConstraint(name="No puede haber dos aulas con el mismo nombre en un establecimiento",
                             fields=("nombre", "establecimiento"))
        ]


class EquipamientoAula(models.Model):
    aula = models.ForeignKey(Aula, on_delete=models.CASCADE, related_name="equipamiento")
    nombre = models.CharField(max_length=MAX_LARGO_NOMBRES)
    cantidad = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.aula}: {self.nombre} x{self.cantidad}"


class Equipamiento(models.Model):
    nombre = models.CharField(max_length=MAX_LARGO_NOMBRES, unique=True)
    cantidad = models.PositiveIntegerField()

    def consultar_reservas(self, ahora=False, fecha: Optional[datetime.date] = None,
                           desde: Optional[datetime.time] = None, hasta: Optional[datetime.time] = None):
        if ahora:
            ahora = datetime.now()
            fecha = ahora.date()
            desde = hasta = ahora.time()

        query = ReservaEquipamiento.objects.filter(equipamiento=self, reserva__fecha=fecha, reserva__desde__lte=desde,
                                                   reserva__hasta__gte=hasta)
        return query

    def disponibilidad(self, ahora=False, fecha: Optional[datetime.date] = None,
                       desde: Optional[datetime.time] = None, hasta: Optional[datetime.time] = None):
        reservas = self.consultar_reservas(ahora, fecha, desde, hasta)
        cantidad = 0
        for reserva in reservas:
            cantidad += reserva.cantidad
        return self.cantidad - cantidad

    def __str__(self):
        return f"{self.nombre} x{self.cantidad}"


class Reserva(models.Model):
    aula = models.ForeignKey(Aula, on_delete=models.CASCADE)
    solicitante = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    fecha = models.DateField()
    desde = models.TimeField()
    hasta = models.TimeField()
    creacion = models.DateTimeField(auto_now_add=True, verbose_name="creación")
    modificacion = models.DateTimeField(auto_now=True, verbose_name="modificación")

    def __str__(self):
        return f"Aula {self.aula}. {self.fecha} de {self.desde} a {self.hasta}"

    def get_item(self, id):
        try:
            return self.equipamiento.get(equipamiento__id=id)
        except ReservaEquipamiento.DoesNotExist:
            return None


class ReservaEquipamiento(models.Model):
    reserva = models.ForeignKey(Reserva, on_delete=models.CASCADE, related_name='equipamiento')
    equipamiento = models.ForeignKey(Equipamiento, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    def __str__(self):
        return f"{self.equipamiento.nombre} x{self.cantidad}"
