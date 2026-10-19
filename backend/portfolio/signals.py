from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Project, SkillCategory, Skill, Experience, Testimonial, ProfileInfo


def bump_knowledge_version():
    """
    Increments AI knowledge version so new/updated projects, skills,
    and profile data immediately propagate into the AI's memory and
    flush stale caches.
    """
    try:
        from ai_assistant.models import AISetting
        setting, _ = AISetting.objects.get_or_create(id=1)
        setting.knowledge_version += 1
        setting.save(update_fields=['knowledge_version', 'updated_at'])
    except Exception:
        pass


@receiver([post_save, post_delete], sender=Project)
@receiver([post_save, post_delete], sender=SkillCategory)
@receiver([post_save, post_delete], sender=Skill)
@receiver([post_save, post_delete], sender=Experience)
@receiver([post_save, post_delete], sender=Testimonial)
@receiver([post_save, post_delete], sender=ProfileInfo)
def on_portfolio_data_changed(sender, instance, **kwargs):
    bump_knowledge_version()
