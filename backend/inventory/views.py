
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from .models import Purchase, Sale
from .serializers import PurchaseSerializer, SaleSerializer
from .services import get_stock_balance
from .models import StockMovement
from django.db.models import ProtectedError
from rest_framework.response import Response
from django.db.models import Sum, F, DecimalField, ExpressionWrapper
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import StockMovement
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
class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def list(self, request):
        products = Product.objects.filter(is_active=True)

        total_stock = 0
        total_stock_value = 0
        low_stock_count = 0

        for product in products:
            stock = get_stock_balance(product)

            total_stock += stock
            total_stock_value += stock * product.purchase_price

            if (
                product.low_stock_threshold > 0
                and stock <= product.low_stock_threshold
            ):
                low_stock_count += 1

        return Response({
            "total_products": products.count(),
            "total_categories": Category.objects.filter(is_active=True).count(),
            "total_suppliers": Supplier.objects.filter(is_active=True).count(),
            "total_customers": Customer.objects.filter(is_active=True).count(),
            "total_purchases": Purchase.objects.filter(status="completed").count(),
            "total_sales": Sale.objects.filter(status="completed").count(),
            "total_stock": total_stock,
            "total_stock_value": total_stock_value,
            "low_stock_count": low_stock_count,
        })

class StockViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def list(self, request):
        products = Product.objects.select_related("category").all()

        data = []

        for product in products:
            stock = get_stock_balance(product)
            threshold = product.low_stock_threshold

            data.append({
                "product_id": product.id,
                "product_name": product.name,
                "sku": product.sku,
                "category_name": product.category.name,
                "base_unit": product.base_unit,
                "units_per_carton": product.units_per_carton,
                "current_stock": stock,
                "low_stock_threshold": threshold,
                "is_low_stock": (
                    threshold > 0 and stock <= threshold
                ),
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
