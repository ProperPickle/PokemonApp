from django.db import models

# Create your models here.
class Pokemon(models.Model):
    lat = models.DecimalField(max_digits=15, decimal_places=8)
    long = models.DecimalField(max_digits=15, decimal_places=8)
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    loc = models.CharField(max_length=100)
    moves = models.JSONField()
    sprite = models.URLField(max_length=200)

    def __str__(self):
        return self.name