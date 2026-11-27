
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from .models import Purchase, Sale
from .serializers import PurchaseSerializer, SaleSerializer
from .services import get_stock_balance
from .models import StockMovement
from django.db.models import ProtectedError
from rest_framework.response import Response
from .models import (
    Category,
    Supplier,
    Customer,
    Product,
)

from .serializers import (
    CategorySerializer,
    SupplierSerializer,
    CustomerSerializer,
    ProductSerializer,
)
class StockViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def list(self, request):
        products = Product.objects.select_related("category").all()

        data = []

        for product in products:
            stock = get_stock_balance(product)

            data.append({
                "product_id": product.id,
                "product_name": product.name,
                "sku": product.sku,
                "category_name": product.category.name,
                "base_unit": product.base_unit,
                "units_per_carton": product.units_per_carton,
                "current_stock": stock,
            })

        return Response(data)

class PurchaseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Purchase.objects.select_related("supplier").prefetch_related(
        "items__product"
    ).all()
    serializer_class = PurchaseSerializer
    permission_classes = [AllowAny]


class SaleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Sale.objects.select_related("customer").prefetch_related(
        "items__product"
    ).all()
    serializer_class = SaleSerializer
    permission_classes = [AllowAny]

class SafeDeleteViewSet(viewsets.ModelViewSet):

    def perform_destroy(self, instance):
        try:
            instance.delete()
        except ProtectedError:
            raise ValidationError({
                "detail": (
                    "This record cannot be deleted because "
                    "it is being used by another record."
                )
            })


class CategoryViewSet(SafeDeleteViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class SupplierViewSet(SafeDeleteViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [AllowAny]


class CustomerViewSet(SafeDeleteViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [AllowAny]


class ProductViewSet(SafeDeleteViewSet):
    queryset = Product.objects.select_related("category").all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
