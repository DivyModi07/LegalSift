from django.apps import AppConfig

class MlengineConfig(AppConfig):       # Class name can be anything, but keep capital‑M
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.mlengine'             # ← exact package path
