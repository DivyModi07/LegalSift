from django.db import models
from apps.users.models import CustomUser

class Complaint(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='complaints')
    complaint_text = models.TextField()
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    date_of_incident = models.DateField()
    predicted_urgency = models.CharField(max_length=20)
    predicted_category = models.CharField(max_length=100)
    recommended_sections = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'complaint_history'

    def __str__(self):
        return f"Complaint {self.pk} by {self.user.email}"