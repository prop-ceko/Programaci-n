from typing import Iterable

from django.contrib.auth.models import User


def intersect(a_beg, a_end, b_beg, b_end):
    return a_beg < b_end and a_end > b_beg


def repeated(collection: Iterable, fun=lambda x: x):
    already = set()
    for item in collection:
        key = fun(item)
        if key in already:
            return True
        already.add(key)
    return False


def create_users(usernames: list):
    users = [User(username=user) for user in usernames]
    User.objects.bulk_create(users)
    return users


def create_from_model(model, data):
    list = [model(**item) for item in data]
    model.objects.bulk_create(list)
    return list
