# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cartoview_geo_observation', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userhistory',
            name='fid',
            field=models.TextField(null=True, blank=True),
        ),
    ]
