from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/complaints/', include('apps.complaints.urls')),
    path("api/ml/", include("apps.mlengine.urls")),
    path('api/users/', include('apps.users.urls')),

]
