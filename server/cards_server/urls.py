"""cards_server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin

import core_user.views
import cards.views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^register/', core_user.views.register),
    url(r'^api/sync-test/', cards.views.sync_test),
    url(r'^add_card/', cards.views.add_card),
    url(r'^auth_user/', core_user.views.auth_user),
    url(r'^get_public/', cards.views.get_public),
    url(r'^delete_card/', cards.views.delete)

]
