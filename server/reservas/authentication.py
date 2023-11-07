from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework import exceptions, authentication


class BasicAuthentication(authentication.BasicAuthentication):
    def authenticate(self, request):
        email, password = request.data.get("email"), request.data.get("password")
        return self.authenticate_credentials(email, password, request)

    def authenticate_credentials(self, email, password, request=None):
        if not email or not password:
            return None

        credentials = {
            get_user_model().EMAIL_FIELD: email,
            'password': password
        }
        user = authenticate(request=request, **credentials)

        if user is None:
            raise exceptions.AuthenticationFailed(_('Invalid email/password.'))

        if not user.is_active:
            raise exceptions.AuthenticationFailed(_('User inactive or deleted.'))

        return user, None
