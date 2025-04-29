from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('EMPLOYEE', 'Employee'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='EMPLOYEE')
    designation = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.username
