# Generated by Django 5.1.3 on 2024-12-08 07:15

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0005_companyinfo'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProfessionalSummaryInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('summary', models.TextField()),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='professional_summary', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]