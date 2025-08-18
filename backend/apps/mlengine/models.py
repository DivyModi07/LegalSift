from django.db import models

class IPCSectionDB(models.Model):
    """
    A Django model to store IPC section data, populated from a CSV file.
    This model is used to query the IPC data for the frontend.
    """
    section_number = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    short_description = models.TextField()
    mapped_category = models.CharField(max_length=100)
    punishment = models.TextField()
    bailability_status = models.CharField(max_length=50)
    court_jurisdiction = models.CharField(max_length=100)
    full_legal_text = models.TextField()

    class Meta:
        db_table = 'ipc_sections'
    def __str__(self):
        return f"Section {self.section_number}: {self.title}"
