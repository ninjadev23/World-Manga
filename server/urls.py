from django.urls import path, include
from rest_framework import routers
from server import views

router = routers.DefaultRouter()
router.register(r'mangas', views.MangaView, 'mangas')
urlpatterns = [
    path('', include(router.urls)),
    path('login', views.login),
    path('signup', views.signup),
    path('mangas/<int:manga_id>/upload-volume/', views.UploadVolumeView.as_view()),
]
