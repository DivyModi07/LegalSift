import os
import pandas as pd
from django.core.management.base import BaseCommand
from django.db import transaction
from django.conf import settings
from apps.mlengine.models import IPCSectionDB

class Command(BaseCommand):
    help = 'Loads IPC sections from CSV into the database.'

    def handle(self, *args, **kwargs):
        project_root = os.path.dirname(settings.BASE_DIR)
        file_path = os.path.join(project_root, 'ml_workspace', 'IPC_Sections_Explore.csv')

        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f"CSV file not found at: {file_path}"))
            return

        self.stdout.write(self.style.SUCCESS('Deleting old IPC data...'))
        IPCSectionDB.objects.all().delete()

        self.stdout.write(self.style.SUCCESS(f'Importing data from {file_path}...'))
        df = pd.read_csv(file_path)

        try:
            with transaction.atomic():
                for index, row in df.iterrows():
                    IPCSectionDB.objects.create(
                        section_number=row['section_number'],
                        title=row['title'],
                        short_description=row['short_description'],
                        mapped_category=row['mapped_category'],
                        punishment=row['punishment'],
                        bailability_status=row['bailability_status'],
                        court_jurisdiction=row['court_jurisdiction'],
                        full_legal_text=row['full_legal_text'],
                    )
            self.stdout.write(self.style.SUCCESS('Successfully imported all IPC data.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error during data import: {e}"))
