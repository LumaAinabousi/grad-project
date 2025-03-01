# Generated by Django 5.1.3 on 2025-01-08 10:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth_api', '0006_remove_endocrinologist_patients_patient_supervisor'),
    ]

    operations = [
        migrations.AddField(
            model_name='patient',
            name='status',
            field=models.CharField(blank=True, choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], max_length=15),
        ),
    ]
