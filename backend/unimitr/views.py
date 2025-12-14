from django.views.generic import TemplateView
from django.conf import settings
from django.http import HttpResponse
from pathlib import Path
import os


class ReactView(TemplateView):
    """
    Serves React's index.html for any frontend route.
    This view is a fallback for all routes not handled by Django API or admin.
    """
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


def serve_react_index(request):
    """
    Fallback view to serve React's index.html for SPA routing.
    Used for any path that doesn't match API or admin endpoints.
    """
    index_path = settings.REACT_BUILD_DIR / 'index.html'
    if index_path.exists():
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return HttpResponse(content, content_type='text/html')
    return HttpResponse('React app not built. Please run "npm run build" in your frontend directory and copy the build output to backend/staticfiles_build/frontend/.', status=404)
