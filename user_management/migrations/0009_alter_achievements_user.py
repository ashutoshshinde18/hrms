# Generated by Django 5.1.3 on 2024-12-28 12:09

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0008_achievements'),
    ]

    operations = [
        migrations.AlterField(
            model_name='achievements',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='achievements', to=settings.AUTH_USER_MODEL),
        ),
    ]