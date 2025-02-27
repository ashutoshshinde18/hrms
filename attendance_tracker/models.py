from django.db import models
from user_management.models import CustomUser

# Create your models here.

class Attendance(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="attendance_records")
    date = models.DateField()
    clock_in_time = models.TimeField(null=True, blank=True)
    clock_out_time = models.TimeField(null=True, blank=True)
    avg_hours_per_day = models.DurationField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ("Available", "Available"),
            ("Out of Office", "Out of Office"),
            ("Half Day", "Half Day"),
        ],
        default="Available"
    ),
    location = models.JSONField(default=dict, blank=True)
    note = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.personal_info.full_name} - {self.date}"                                                   

class AttendanceAdjustment(models.Model):
    attendance = models.OneToOneField(Attendance, on_delete=models.CASCADE, related_name="adjustment")
    adjustment_timestamp = models.DateTimeField(auto_now_add=True)
    regularise_status = models.CharField(
        max_length=20,
        choices=[
            ("Pending", "Pending"),
            ("Approved", "Approved"),
            ("Rejected", "Rejected"),
        ],
        default="Pending",
    )
    regularise_note = models.TextField(null=True, blank=True)
    approved_by = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"Adjustment for {self.attendance.user.personal_info.full_name} on {self.attendance.date}"