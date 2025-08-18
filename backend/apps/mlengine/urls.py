from django.urls import path
from . import views
urlpatterns = [ 
    path("chat/", views.chat, name="rag-chat"),
    path("ipc/", views.IPCSectionListView.as_view(), name="ipc-sections-list"),
      ]
