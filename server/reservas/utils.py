from typing import Iterable, Type

from django.contrib.auth.models import User
from django.db.models import Model


def intersect(a_beg, a_end, b_beg, b_end):
    return a_beg < b_end and a_end > b_beg


def create_users(usernames: list):
    users = [User(username=user) for user in usernames]
    User.objects.bulk_create(users)
    return users


def create_from_model(model, data):
    list = [model(**item) for item in data]
    model.objects.bulk_create(list)
    return list
