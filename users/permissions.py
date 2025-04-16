from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsOperator(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'operator'


class IsViewer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'viewer'


"""

HTTP Method    	Route	    Admin	    Operator	    Viewer	    Unauthenticated
GET	            /clients/	 ✅        	   ✅	          ✅	          ❌
POST	        /clients/	 ✅	           ❌	          ❌	          ❌
GET	        /clients/<id>/	 ✅	           ✅	          ✅	          ❌
PUT	        /clients/<id>/	 ✅	           ❌ 	          ❌	          ❌
DELETE	    /clients/<id>/	 ✅ 	       ❌	          ❌	          ❌
"""
