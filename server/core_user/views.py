# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

from django.http import HttpResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import get_user_model

from core_user.models import User
from cards.models import Card

import json

@csrf_exempt  
def register(request):
	if request.method == 'POST':
		try:
			json_data = json.loads(request.body)

			user = User.objects.create(login = json_data['username'], password = json_data['password'], email = json_data['email'])
			user.save
		except:
			return JsonResponse({'success': False})
		return JsonResponse({'success': True})

@csrf_exempt  
def auth_user(request):
	login = json.loads(request.body)['username']
	password = json.loads(request.body)['password']
	try:
		db_user = User.objects.get(login = login, password = password)
	except:
		return JsonResponse({'success': False})
	return JsonResponse({'success': True})
