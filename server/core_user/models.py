# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

class User(models.Model):
	user_id = models.AutoField(primary_key=True, unique=True)
	login = models.CharField(max_length=30, unique=True)
	email = models.CharField(max_length=50, null=True)
	password = models.CharField(max_length=50)

class Meta:
	db_table = u'User'

	def __unicode__(self):
		return u'%d %s %s' % (self.pk, self.login, self.password)