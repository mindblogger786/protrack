# Generated by Django 5.2 on 2025-04-21 21:42

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('attendance', '0006_alter_attendance_punch_in_photo'),
    ]

    operations = [
        migrations.AddField(
            model_name='leaverequest',
            name='date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='leaverequest',
            name='leave_type',
            field=models.CharField(choices=[('sick', 'Sick Leave'), ('casual', 'Casual Leave'), ('paid', 'Paid Leave')], max_length=10),
        ),
    ]
