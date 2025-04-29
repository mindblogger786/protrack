from django.db import models
from django.conf import settings
from django.utils import timezone

STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
)


class Attendance(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    punch_in = models.TimeField(null=True, blank=True)
    punch_out = models.TimeField(null=True, blank=True)
    punch_in_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    punch_in_photo = models.ImageField(upload_to='punch_photos/in/', null=True, blank=True)
    punch_out_photo = models.ImageField(upload_to='punch_photos/out/', null=False, blank=False)
    location = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.date}"


class LeaveRequest(models.Model):
    LEAVE_TYPES = (
        ('sick', 'Sick Leave'),
        ('casual', 'Casual Leave'),
        ('paid', 'Paid Leave'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    leave_type = models.CharField(max_length=10, choices=LEAVE_TYPES)
    date = models.DateField(default=timezone.now)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.leave_type} ({self.status})"
