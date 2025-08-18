from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Listing
from .serializers import ListingSerializer

class ListingListView(generics.ListAPIView):
    queryset = Listing.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = ListingSerializer
    permission_classes = [AllowAny]

# --- ADD THIS NEW VIEW ---
class ListingDetailView(generics.RetrieveAPIView):
    """
    Provides the details for a single listing. Publicly accessible.
    """
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id' # Tell the view to find listings by the 'id' field in the URL

class ListingCreateView(generics.CreateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(lister=self.request.user)