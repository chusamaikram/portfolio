from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users (staff or superuser) to edit/delete items.
    Read-only requests (GET, HEAD, OPTIONS) are allowed for any guest visitor.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or request.user.is_superuser)
        )


class IsAdminOrPostOnly(permissions.BasePermission):
    """
    Permission for public contact inbox:
    - POST (create message): Allowed for anyone (guest visitors).
    - GET, PUT, PATCH, DELETE (read, modify, delete messages): Restricted to authenticated admins.
    """

    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or request.user.is_superuser)
        )
