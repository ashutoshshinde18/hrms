# Generated by Django 5.1.3 on 2024-12-28 12:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0009_alter_achievements_user'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Achievements',
        ),
    ]
