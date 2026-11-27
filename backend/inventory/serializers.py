
from rest_framework import serializers

from .models import (
    Category,
    Supplier,
    Customer,
    Product,
    Purchase,
    PurchaseItem,
    Sale,
    SaleItem,
)

class PurchaseItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    class Meta:
        model = PurchaseItem
        fields = "__all__"
        read_only_fields = [
            "id",
            "conversion_factor",
            "base_quantity",
            "total_price",
        ]


class PurchaseSerializer(serializers.ModelSerializer):
    items = PurchaseItemSerializer(many=True, read_only=True)
    supplier_name = serializers.CharField(
        source="supplier.company_name",
        read_only=True
    )

    class Meta:
        model = Purchase
        fields = "__all__"
        read_only_fields = [
            "id",
            "status",
            "created_at",
            "updated_at",
        ]


class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    class Meta:
        model = SaleItem
        fields = "__all__"
        read_only_fields = [
            "id",
            "conversion_factor",
            "base_quantity",
            "total_price",
        ]


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(
        source="customer.shop_name",
        read_only=True
    )

    class Meta:
        model = Sale
        fields = "__all__"
        read_only_fields = [
            "id",
            "status",
            "created_at",
            "updated_at",
        ]
class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "description",
            "is_active",
            "product_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "product_count",
            "created_at",
            "updated_at",
        ]

    def get_product_count(self, obj):
        return obj.products.count()


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    class Meta:
        model = Product
        fields = [
            "id", "name", "sku", "brand", "category", "category_name",
            "base_unit", "units_per_carton", "purchase_price",
            "selling_price", "description", "is_active",
            "created_at", "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        units_per_carton = attrs.get(
            "units_per_carton",
            getattr(self.instance, "units_per_carton", 12),
        )

        if units_per_carton < 1:
            raise serializers.ValidationError({
                "units_per_carton": "Must be at least 1."
            })

        purchase_price = attrs.get(
            "purchase_price",
            getattr(self.instance, "purchase_price", None),
        )

        selling_price = attrs.get(
            "selling_price",
            getattr(self.instance, "selling_price", None),
        )

        if purchase_price is not None and purchase_price < 0:
            raise serializers.ValidationError({
                "purchase_price": "Cannot be negative."
            })

        if selling_price is not None and selling_price < 0:
            raise serializers.ValidationError({
                "selling_price": "Cannot be negative."
            })

        return attrs
