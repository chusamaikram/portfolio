from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet,
    SkillCategoryViewSet,
    TestimonialViewSet,
    ExperienceViewSet,
    ContactMessageViewSet,
    ProfileInfoView,
    TelemetryView,
)

app_name = 'portfolio'

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'skills', SkillCategoryViewSet, basename='skill')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'experiences', ExperienceViewSet, basename='experience')
router.register(r'messages', ContactMessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
    path('contact/', ContactMessageViewSet.as_view({'post': 'create'}), name='contact_alias'),
    path('profile/', ProfileInfoView.as_view(), name='profile_info'),
    path('telemetry/', TelemetryView.as_view(), name='telemetry'),
]
