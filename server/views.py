from rest_framework import viewsets, permissions, status, filters
from .serializers import MangaSerializer, UserSerializer, VolumeSerializer
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from .models import Manga, AppUser, Volume
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from dotenv import load_dotenv
import os

load_dotenv()

class CookieTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get('auth_token')
        if not token:
            return None
        return self.authenticate_credentials(token)

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Permite lectura a cualquiera, pero escritura solo al dueño
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user

class MangaView(viewsets.ModelViewSet):
    queryset = Manga.objects.all()
    serializer_class = MangaSerializer
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,IsOwnerOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'language']
    def perform_create(self, serializer):
        # Asigna el usuario autenticado al crear un manga
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        queryset = Manga.objects.all()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(categories__contains=[category])        
        return queryset
        
class UploadVolumeView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    authentication_classes = [CookieTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, manga_id):
        try:
            manga = Manga.objects.get(pk=manga_id, user=request.user)
        except Manga.DoesNotExist:
            return Response({'detail': 'Manga not found or unauthorized'}, status=404)

        serializer = VolumeSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            volume = serializer.save(manga=manga)
            return Response(VolumeSerializer(volume).data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data = request.data)
    if serializer.is_valid():
        newUser = serializer.save()
        newUser.set_password(serializer.data['password'])
        newUser.is_active = True
        newUser.save()
        token, created = Token.objects.get_or_create(user=newUser)
        response = Response(serializer.data, status = status.HTTP_201_CREATED)
        cookie_secure = os.environ.get('COOKIE_SECURE', 'False').lower() == 'true'
        response.set_cookie(
            key = 'auth_token',
            value = token.key,
            httponly = True,
            max_age = 60 * 60 * 24 * 20,  # 20 días en segundos,
            secure = cookie_secure,
            samesite='None' if cookie_secure else 'Lax' 
        )
        
        return response
        
    return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    user = get_object_or_404(AppUser, email = email)
    if not user.check_password(password):
        return Response({
            'error': 'Incorrect Password'
        },status = status.HTTP_400_BAD_REQUEST)
        
    token, created = Token.objects.get_or_create(user=user)
    response = Response({
        "token": token.key 
    })
    cookie_secure = os.environ.get('COOKIE_SECURE', 'False').lower() == 'true'
    response.set_cookie(
        key = 'auth_token',
        value = token.key,
        httponly = True,
        max_age = 60 * 60 * 24 * 20,  # 20 días en segundos,
        secure = cookie_secure,
        samesite='None' if cookie_secure else 'Lax' 
    )
            
    return response
    
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([CookieTokenAuthentication])
def profile(request):
    user = get_object_or_404(AppUser, email = request.user)
    serializer = UserSerializer(instance=user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([CookieTokenAuthentication])
def mangas_of_user(request):
    mangas = Manga.objects.filter(user=request.user)
    serializer = MangaSerializer(mangas, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([CookieTokenAuthentication])
def update_user(request):
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([CookieTokenAuthentication])
def logout(request):
    response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
    response.delete_cookie("auth_token")
    Token.objects.filter(user=request.user).delete()

    return response
