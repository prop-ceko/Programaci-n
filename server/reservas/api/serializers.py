from datetime import datetime, time
from typing import Iterable

from rest_framework import serializers

from reservas.models import Equipamiento, Establecimiento, EquipamientoAula, Reserva, Aula, Edificio, \
    ReservaEquipamiento
from reservas.settings import RESERVA_DURACION_MINIMA, RESERVA_HORARIO_MINIMO, RESERVA_HORARIO_MAXIMO, \
    RESERVA_DURACION_MAXIMA


def differ_from_instance(instance, data: dict, fields: Iterable[str]) -> bool:
    for field in fields:
        if field in data and getattr(instance, field) != data[field]:
            return True
    return False


# django.db.models.fields.related_descriptors.create_forward_many_to_many_manager()

def update_fields(instance, data, fields: Iterable[str]):
    for field in fields:
        setattr(instance, field, data[field])


def update_if_different(instance, data, fields: Iterable[str]):
    any_changed = False
    for field in fields:
        if getattr(instance, field) != data[field]:
            any_changed = True
            setattr(instance, field, data[field])

    return any_changed


class RelatedField(serializers.RelatedField):
    pass


class EquipamientoAulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipamientoAula
        exclude = ('id', 'aula')


class AulaSerializer(serializers.ModelSerializer):
    equipamiento = EquipamientoAulaSerializer(many=True)
    disponible = serializers.SerializerMethodField()

    class Meta:
        model = Aula
        fields = ('id', 'nombre', 'equipamiento', 'disponible')

    @staticmethod
    def get_disponible(aula: Aula):
        return aula.disponible(ahora=True) is None


class EstablecimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Establecimiento
        fields = '__all__'


class EdificioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Edificio
        fields = '__all__'


class EquipamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipamiento
        fields = '__all__'


class EquipamientoFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipamiento
        exclude = ('id',)


class ReservaEquipamientoSerializer(serializers.ModelSerializer):
    # nombre = serializers.CharField(source="equipamiento.nombre")

    class Meta:
        model = ReservaEquipamiento
        fields = ('equipamiento', 'cantidad')


class ReservaSerializer(serializers.ModelSerializer):
    solicitante = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    equipamiento = ReservaEquipamientoSerializer(many=True, required=False, default=[])

    class Meta:
        model = Reserva
        fields = ('id', 'aula', 'fecha', 'desde', 'hasta', 'solicitante', 'equipamiento')

    def create(self, validated_data):
        equipamiento = validated_data.pop("equipamiento")

        reserva = Reserva.objects.create(**validated_data)
        items = [
            ReservaEquipamiento(reserva=reserva, **item)
            for item in equipamiento
        ]

        ReservaEquipamiento.objects.bulk_create(items)
        return reserva

    def update(self, reserva: Reserva, validated_data):
        no_encontrado = [equipamiento.id for equipamiento in reserva.equipamiento.all()]

        sin_cambios = self.to_internal_value(self.to_representation(reserva)) == validated_data
        if sin_cambios:
            raise serializers.ValidationError("Sin cambios")

        update_fields(reserva, validated_data, ("aula", "fecha", "desde", "hasta"))
        reserva.save()

        for data in validated_data.get("equipamiento"):
            equipamiento = reserva.get_item(data["equipamiento"].id)
            if equipamiento is None:
                ReservaEquipamiento.objects.create(reserva, **data)
            else:
                equipamiento.cantidad = data['cantidad']
                equipamiento.save()
                no_encontrado.remove(equipamiento.id)

        for id in no_encontrado:
            ReservaEquipamiento.objects.get(id=id).delete()

        return reserva

    @staticmethod
    def validate_desde(value: time):
        if value < RESERVA_HORARIO_MINIMO:
            raise serializers.ValidationError(f"La reserva debe empezar de las {RESERVA_HORARIO_MINIMO} en adelante")
        return value

    @staticmethod
    def validate_hasta(value: time):
        if value > RESERVA_HORARIO_MAXIMO:
            raise serializers.ValidationError(f"La reserva debe terminar a las {RESERVA_HORARIO_MAXIMO} o antes")
        return value

    @staticmethod
    def validate_equipamiento(value: Iterable):
        def mapping(item: dict):
            return item["equipamiento"]

        # cantidad_equipamiento = dict()
        set_equipamiento = set()
        for equipamiento in map(mapping, value):
            # cantidad_equipamiento[equipamiento] = cantidad_equipamiento.get(equipamiento, 0) + 1
            if equipamiento in set_equipamiento:
                raise serializers.ValidationError(
                    "Se detectaron múltiples entradas para algunos equipamientos. "
                    "Debe haber una única entrada por equipamiento")

            set_equipamiento.add(equipamiento)

        # repetidos = []
        # for equipamiento in cantidad_equipamiento:
        #     if cantidad_equipamiento[equipamiento] > 1:
        #         repetidos.append(str(equipamiento.id))
        #
        # if len(repetidos) > 0:
        #     raise serializers.ValidationError(
        #         f"Se detectaron múltiples entradas para los equipamientos {', '.join(repetidos)}. "
        #         f"Solo debe haber una única entrada por equipamiento")

        return value

    def validate(self, attrs):
        fecha = attrs["fecha"]
        desde = attrs["desde"]
        hasta = attrs["hasta"]
        aula = attrs["aula"]
        equipamiento = attrs.get("equipamiento")

        self.validar_duracion(desde, fecha, hasta)
        self.encontrar_otras_reservas(aula, desde, fecha, hasta)
        self.confirmar_disponibilidad_equipamiento(fecha, desde, hasta, equipamiento)
        return attrs

    def confirmar_disponibilidad_equipamiento(self, fecha, desde, hasta, equipamiento_extra):
        for item in equipamiento_extra:
            equipamiento = item["equipamiento"]
            cantidad_requerida = item["cantidad"]
            if cantidad_requerida > equipamiento.cantidad:
                raise serializers.ValidationError(
                    f"Solo hay {equipamiento.cantidad} {equipamiento.nombre} en toda la universidad.")

            unidades_disponibles = equipamiento.disponibilidad(fecha=fecha, desde=desde, hasta=hasta)
            if self.instance is not None:
                try:
                    reserva = ReservaEquipamiento.objects.get(reserva=self.instance.id, equipamiento=equipamiento)
                    unidades_disponibles += reserva.cantidad
                except Exception as e:
                    print(type(e))
                    pass
            if cantidad_requerida > unidades_disponibles:
                raise serializers.ValidationError(
                    f"Solo hay {unidades_disponibles} {equipamiento.nombre} disponibles en ese momento.")

    def encontrar_otras_reservas(self, aula, desde, fecha, hasta):
        reserva = aula.disponible(fecha=fecha, desde=desde, hasta=hasta)
        if reserva is not None and (self.instance is None or self.instance.id != reserva.id):
            raise serializers.ValidationError("Ya hay una reserva en ese horario")

    @staticmethod
    def validar_duracion(desde, fecha, hasta):
        duracion = datetime.combine(fecha, hasta) - datetime.combine(fecha, desde)
        if duracion < RESERVA_DURACION_MINIMA:
            raise serializers.ValidationError(f"La reserva debe durar por lo menos {RESERVA_DURACION_MINIMA}")
        if duracion > RESERVA_DURACION_MAXIMA:
            raise serializers.ValidationError(f"La reserva puede durar hasta {RESERVA_DURACION_MAXIMA}")
