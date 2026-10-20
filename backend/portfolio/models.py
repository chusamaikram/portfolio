from django.db import models


class Project(models.Model):
    """
    Portfolio project showcase item
    """
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.TextField(help_text="Base64 encoded string, asset path, or image URL", blank=True)
    tags = models.JSONField(default=list, blank=True)
    live_url = models.CharField(max_length=500, blank=True, verbose_name="Live Demo URL")
    github_url = models.CharField(max_length=500, blank=True, verbose_name="GitHub Repository URL")
    featured = models.BooleanField(default=False)
    category = models.CharField(max_length=100, default='Web App')
    architecture = models.TextField(blank=True)
    metrics = models.CharField(max_length=255, blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title


class SkillCategory(models.Model):
    """
    Category grouping for technical skills (e.g. Frontend Core, Frameworks & Libraries)
    """
    name = models.CharField(max_length=100, unique=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name_plural = 'Skill Categories'

    def __str__(self):
        return self.name


class Skill(models.Model):
    """
    Individual technical skill with proficiency level and icon
    """
    category = models.ForeignKey(SkillCategory, related_name='skills', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    level = models.IntegerField(default=80)
    icon = models.CharField(max_length=100, default='Code')
    highlight = models.CharField(max_length=255, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.name} ({self.category.name})"


class Testimonial(models.Model):
    """
    Client and colleague endorsements
    """
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    content = models.TextField()
    rating = models.IntegerField(default=5)
    avatar = models.TextField(blank=True)
    visible = models.BooleanField(default=True)
    date = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.company}"


class Experience(models.Model):
    """
    Career milestones and timeline
    """
    role = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    period = models.CharField(max_length=100)
    description = models.TextField()
    tags = models.JSONField(default=list, blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.role} at {self.company}"


class ContactMessage(models.Model):
    """
    Inbound messages received from public portfolio contact form
    """
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=300, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Message from {self.name} ({self.email})"


class ProfileInfo(models.Model):
    """
    Bio and personal brand metadata
    """
    name = models.CharField(max_length=200, default='Usama Ikram')
    title = models.CharField(max_length=300, default='Principal Frontend Architect & Web Engineer')
    bio = models.TextField(default='Specialized in engineering sleek, modular frontend components with modern React, Tailwind CSS, and lightweight 3D graphics.')
    avatar = models.TextField(blank=True, default='', help_text="Base64 encoded string or image URL for profile headshot")
    about_image = models.TextField(blank=True, default='', help_text="Base64 encoded string or image URL for About section sticky cutout portrait")
    location = models.CharField(max_length=200, default='Lahore, Pakistan')
    email = models.EmailField(default='usama.code404@gmail.com')
    phone = models.CharField(max_length=100, default='+92 309 8525906')
    github = models.URLField(default='https://github.com/chusamaikram')
    linkedin = models.URLField(default='https://linkedin.com/in/usama-ikram-252052182')
    status = models.CharField(max_length=200, default='Available for Freelance & Full-time Roles')
    hero_visual_type = models.CharField(
        max_length=50,
        default='laptop',
        choices=[
            ('laptop', '3D Tech Laptop'),
            ('brain', '3D AI Neural Brain'),
            ('globe', '3D Holographic Tech Globe'),
        ],
        help_text="Active 3D visual showcase mode in Hero Section",
    )
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
