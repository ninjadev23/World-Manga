from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.views.static import serve as django_serve
from rest_framework.documentation import include_docs_urls
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('server.urls')),
    path('docs/', include_docs_urls(title="Manga API")),
]
urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', django_serve, {'document_root': settings.MEDIA_ROOT}),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]