from rest_framework import serializers
from .models import Manga, AppUser, Volume
import os

class MangaSerializer(serializers.ModelSerializer):
    volumes = serializers.SerializerMethodField()
    username = serializers.ReadOnlyField(source='user.username')
    authorAvatar = serializers.SerializerMethodField()
    class Meta:
        model = Manga
        fields = [
            'id',
            'title',
            'description',
            'categories',
            'language',
            'cover',
            'user',
            'username',
            'authorAvatar',
            'volumes',
        ]
        read_only_fields = ['user']
     
    def validate_cover(self, value):
        ext = os.path.splitext(value.name)[1].lower()
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.webp']
        allowed_mime_types = ['image/jpeg', 'image/png', 'image/webp']

        if ext not in allowed_extensions:
            raise serializers.ValidationError('Solo se permiten imágenes JPG, PNG o WebP.')

        if hasattr(value, 'content_type') and value.content_type not in allowed_mime_types:
            raise serializers.ValidationError('El tipo MIME de la imagen no es válido.')

        return value

    def get_volumes(self, obj):
        volumes = Volume.objects.filter(manga=obj).order_by('number')
        return VolumeSerializer(volumes, many=True).data


    def get_authorAvatar(self, obj):
        request = self.context.get('request')
        if obj.user.avatar and hasattr(obj.user.avatar, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.user.avatar.url)
            return obj.user.avatar.url
        return None
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = '__all__'

class VolumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Volume
        fields = ['number', 'file', 'cover']
    
    def validate_file(self, value):
        ext = os.path.splitext(value.name)[1].lower()
        allowed_extensions = ['.pdf']
        allowed_mime_types = ['application/pdf']

        if ext not in allowed_extensions:
            raise serializers.ValidationError('Solo se permiten archivos PDF.')
        
        if hasattr(value, 'content_type') and value.content_type not in allowed_mime_types:
            raise serializers.ValidationError('El tipo MIME del archivo no es válido. Solo PDFs.')

        return value

    def validate_cover(self, value):
        ext = os.path.splitext(value.name)[1].lower()
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.webp']
        allowed_mime_types = ['image/jpeg', 'image/png', 'image/webp']

        if ext not in allowed_extensions:
            raise serializers.ValidationError('Solo se permiten imágenes JPG, PNG o WebP para la portada.')

        if hasattr(value, 'content_type') and value.content_type not in allowed_mime_types:
            raise serializers.ValidationError('El tipo MIME de la imagen no es válido.')

        return value
