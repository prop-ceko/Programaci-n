from django.contrib import admin

from reservas.models import Aula, Edificio, EquipamientoAula, Equipamiento, Establecimiento, Reserva, \
    ReservaEquipamiento


# Register your models here.

@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    readonly_fields = ('creacion', 'modificacion')


for model in (Aula, Edificio, EquipamientoAula, Equipamiento, ReservaEquipamiento, Establecimiento):
    admin.site.register(model)
