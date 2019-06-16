# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from cards.models import Card

from django.http import JsonResponse

import json
from datetime import datetime
import time

@csrf_exempt  
def sync_test(request):
	if request.method == 'POST':
		recieved_cards = json.loads(request.body)['cards']
		onwer_id = json.loads(request.body)['username']
		db_cards = Card.objects.filter(owner = onwer_id)

		response = {'needed_cards' : [], 'sync_cards' : []}

		for card in recieved_cards:
			try:
				fcard = db_cards.get(card_id = card['ID']) 
				if datetime.strptime(card['changed'], '%Y-%m-%dT%H:%M:%S.%fZ') > fcard.updated_timestamp.replace(tzinfo=None):  #Заметка из запроса новее
					print('kek')
					fcard.card_id = card['ID']
					fcard.name = card['title']
					fcard.tags = card['tags']
					fcard.terms = card['terms']
					fcard.author = card['author']
					fcard.created_date = card['created']
					fcard.updated_timestamp = card['changed']
					fcard.status = card['public']
					fcard.save()                             #Записываю заметку в базу
				elif datetime.strptime(card['changed'], '%Y-%m-%dT%H:%M:%S.%fZ') < fcard.updated_timestamp.replace(tzinfo=None):  #Заметка из запроса старее
					print('mem')
					sync_cards = {'ID': fcard.card_id, 'title': fcard.name, 'tags': fcard.tags, 'terms': fcard.terms, 'author': fcard.author, 'created': fcard.created_date, 'changed': fcard.updated_timestamp, 'public': fcard.status}
					response['sync_cards'].append(sync_cards)  #Отправляю эту заметку
			except:
				response['needed_cards'].append(card['ID'])  #Заметка не нашлась, запрашиваю ее

		for card in db_cards:
			flag = False
			for rcard in recieved_cards:
				if rcard['ID'] == card._id:
					flag = True 
			if not flag:
				print(card.card_id)
				sync_cards = {'ID': card.card_id, 'title': card.name, 'tags': card.tags, 'terms': card.terms, 'author': card.author, 'created': card.created_date, 'changed': card.updated_timestamp, 'public': card.status}
				response['sync_cards'].append(sync_cards)

	return JsonResponse(response)

@csrf_exempt 
def add_card(request):
	problems = False
	if request.method == 'POST':
		owner = json.loads(request.body)['username']
		json_data = json.loads(request.body)['cards']
		for card in json_data:
			try:
				id = Card.objects.all().last().id + 1
			except:
				id = 1
			try:
				new_card = Card.objects.create(id = id, card_id=card['ID'], owner=owner, name=card['title'], tags=card['tags'], terms=card['terms'], author=card['author'], created_date=card['created'], updated_timestamp=card['changed'], status=card['public'])
				new_Card.save
			except:
				problems = True
	if problems:
		return JsonResponse({'success': False})
	else:
		return JsonResponse({'success': True})

@csrf_exempt 
def get_public(request):
	public_cards = Card.objects.filter(status=True)
	cards = {'public_cards': []}
	for card in public_cards:
		returned_card = {'ID': card.card_id, 'title': card.name, 'tags': card.tags, 'terms': card.terms, 'author': card.author, 'created': card.created_date, 'changed': card.updated_timestamp, 'public': card.status}
		cards['public_cards'].append(returned_card)
	return JsonResponse(cards)


@csrf_exempt 
def delete(request):
	json_data = json.loads(request.body)
	try:
		Card.objects.get(card_id=json_data['ID'], owner=json_data['username']).delete()
	except:
		return JsonResponse({'success':False})
	return JsonResponse({'success':True})














