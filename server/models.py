from django.db import models
from django.contrib.auth.models import AbstractUser
import os
from datetime import datetime
import uuid

# Create your models here.

def unique_volume_file_path(instance, filename):
    ext = filename.split('.')[-1]
    # Ejemplo: volume_20250715_194659_uuid4.pdf
    filename = f"volume_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}.{ext}"
    return os.path.join('volumes', filename)

def unique_cover_image_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"cover_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}.{ext}"
    return os.path.join('covers', filename)

def unique_avatar_image_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"user_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}.{ext}"
    return os.path.join('users', filename)


class Volume(models.Model):
    manga = models.ForeignKey('Manga', related_name='volumes', on_delete=models.CASCADE)
    file = models.FileField(upload_to=unique_volume_file_path)
    cover = models.ImageField(upload_to=unique_cover_image_path, default='volumes/covers/default-cover.webp')
    number = models.PositiveIntegerField()
    read_only_fields = ['manga']
    def __str__(self):
        return f"Volume {self.number} of {self.manga.title}"

class Manga(models.Model):
    LANG_CHOICES = [
        ('english', 'english'),
        ('español', 'español'),
        ('francais', 'francais'),
        ('Japanese', 'Japanese')
    ]
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    categories = models.JSONField(blank=True, default=list)
    user = models.ForeignKey('server.AppUser', on_delete=models.CASCADE)
    language = models.CharField(choices=LANG_CHOICES, max_length=10)    
    cover = models.ImageField(upload_to=unique_cover_image_path)

class AppUser(AbstractUser):
    username = models.CharField(max_length=100, unique=False)
    email = models.CharField(max_length=200, unique=True)
    favorites = models.JSONField(blank=True, default=list)
    avatar = models.ImageField(upload_to=unique_avatar_image_path, default="/users/default-avatar.webp")
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email