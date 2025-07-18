from django.contrib import admin
from .models import Manga, AppUser

admin.site.register([Manga, AppUser])

