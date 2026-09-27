from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    ROLE_CHOICES = [
        ("student", "Student"),
        ("client", "Client"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    phone = models.CharField(
        max_length=15,
        blank=True
    )

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES
    )

    def __str__(self):
        return f"{self.user.username} - {self.role}"


class Job(models.Model):
    client = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name="jobs",
        null=True,
        blank=True
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    location = models.CharField(max_length=100)

    date = models.DateField()

    time = models.TimeField()

    students = models.IntegerField()

    payment = models.IntegerField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title


class Application(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    ]

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    student = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="pending"
    )

    applied_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.student.user.username} - {self.job.title}"