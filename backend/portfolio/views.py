from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle, AnonRateThrottle

from .models import (
    Project,
    SkillCategory,
    Skill,
    Testimonial,
    Experience,
    ContactMessage,
    ProfileInfo,
)
from .serializers import (
    ProjectSerializer,
    SkillCategorySerializer,
    TestimonialSerializer,
    ExperienceSerializer,
    ContactMessageSerializer,
    ProfileInfoSerializer,
)
from .permissions import IsAdminOrReadOnly, IsAdminOrPostOnly


class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Portfolio Projects.
    - Public (Guest): GET, HEAD, OPTIONS
    - Admin Only: POST, PUT, PATCH, DELETE
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None


class SkillCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Skill Matrix categories and skills.
    - Public: GET
    - Admin: POST, PUT, PATCH, DELETE
    """
    queryset = SkillCategory.objects.all().prefetch_related('skills')
    serializer_class = SkillCategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None

    def create(self, request, *args, **kwargs):
        # Support bulk category array upload if sent from frontend
        if isinstance(request.data, list):
            SkillCategory.objects.all().delete()
            for cat_idx, cat_data in enumerate(request.data):
                category = SkillCategory.objects.create(
                    name=cat_data.get('name', f"Category {cat_idx+1}"),
                    order=cat_idx
                )
                skills_list = cat_data.get('skills', [])
                for skill_idx, s in enumerate(skills_list):
                    Skill.objects.create(
                        category=category,
                        name=s.get('name', ''),
                        level=s.get('level', 80),
                        icon=s.get('icon', 'Code'),
                        highlight=s.get('highlight', ''),
                        order=skill_idx
                    )
            categories = SkillCategory.objects.all().prefetch_related('skills')
            return Response(SkillCategorySerializer(categories, many=True).data, status=status.HTTP_200_OK)
        return super().create(request, *args, **kwargs)


class TestimonialViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Testimonials.
    - Public: GET
    - Admin: POST, PUT, PATCH, DELETE
    """
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None


class ExperienceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Career Experience Timeline.
    - Public: GET
    - Admin: POST, PUT, PATCH, DELETE
    """
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None


class ContactMessageThrottle(AnonRateThrottle):
    scope = 'contact'


class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Contact Messages.
    - Public (Guest): POST (submit contact message, throttled)
    - Admin: GET (view inbox), PUT, PATCH, DELETE
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAdminOrPostOnly]
    throttle_classes = [ContactMessageThrottle]
    pagination_class = None


class ProfileInfoView(APIView):
    """
    Singleton Endpoint for Usama's Bio & Profile Metadata.
    GET /api/v1/portfolio/profile/
    PUT /api/v1/portfolio/profile/ (Admin Only)
    """
    permission_classes = [IsAdminOrReadOnly]

    def get_object(self):
        profile, _ = ProfileInfo.objects.get_or_create(id=1)
        return profile

    def get(self, request):
        profile = self.get_object()
        serializer = ProfileInfoSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        profile = self.get_object()
        serializer = ProfileInfoSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TelemetryView(APIView):
    """
    System Telemetry & Metrics summary for Admin Dashboard.
    GET /api/v1/portfolio/telemetry/
    """
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request):
        return Response({
            'total_projects': Project.objects.count(),
            'featured_projects': Project.objects.filter(featured=True).count(),
            'total_skills': Skill.objects.count(),
            'total_testimonials': Testimonial.objects.count(),
            'total_experiences': Experience.objects.count(),
            'total_messages': ContactMessage.objects.count(),
            'unread_messages': ContactMessage.objects.filter(is_read=False).count(),
            'status': 'HEALTHY',
            'version': '1.0.0-enterprise',
        }, status=status.HTTP_200_OK)
