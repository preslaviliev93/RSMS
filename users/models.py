from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('operator', 'Operator'),
        ('viewer', 'Viewer'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='viewer')

    def __str__(self):
        return self.username


# This class will be used to log user login/logouts lat login
class UserLogs(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    log_type = models.CharField(max_length=20) # Login / Logout / Password Change / ACK ALARMS
    message = models.TextField(max_length="200", null=True, blank=True)

    def __str__(self):
        return f"[{self.log_type}] - [{self.timestamp}] - [{self.user}] - [{self.message}]"