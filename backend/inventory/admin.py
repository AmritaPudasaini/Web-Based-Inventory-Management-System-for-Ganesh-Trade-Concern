
from django.contrib import admin, messages

from .models import (
    Category,
    Supplier,
    Customer,
    Product,
    Purchase,
    PurchaseItem,
    StockMovement,
)
from .services import complete_purchase


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active", "created_at")
    search_fields = ("name",)
    list_filter = ("is_active",)


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = (
        "company_name",
        "contact_person",
        "phone",
        "is_active",
    )
    search_fields = ("company_name", "contact_person", "phone")
    list_filter = ("is_active",)


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = (
        "shop_name",
        "contact_person",
        "phone",
        "is_active",
    )
    search_fields = ("shop_name", "contact_person", "phone")
    list_filter = ("is_active",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "sku",
        "category",
        "base_unit",
        "units_per_carton",
        "purchase_price",
        "selling_price",
        "is_active",
    )
    search_fields = ("name", "sku", "brand")
    list_filter = ("category", "base_unit", "is_active")


class PurchaseItemInline(admin.TabularInline):
    model = PurchaseItem
    extra = 1


@admin.action(description="Complete selected draft purchases")
def complete_selected_purchases(modeladmin, request, queryset):
    completed_count = 0

    for purchase in queryset:
        try:
            complete_purchase(purchase.pk)
            completed_count += 1

        except Exception as exc:
            modeladmin.message_user(
                request,
                f"Purchase {purchase.invoice_number} failed: {exc}",
                level=messages.ERROR,
            )

    if completed_count:
        modeladmin.message_user(
            request,
            f"{completed_count} purchase(s) completed successfully.",
            level=messages.SUCCESS,
        )


@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = (
        "invoice_number",
        "supplier",
        "purchase_date",
        "status",
    )
    search_fields = ("invoice_number", "supplier__company_name")
    list_filter = ("status", "purchase_date")
    inlines = [PurchaseItemInline]
    readonly_fields = ("status", "created_at", "updated_at")
    actions = [complete_selected_purchases]


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = (
        "product",
        "movement_type",
        "quantity",
        "reference",
        "created_at",
    )
    search_fields = ("product__name", "reference")
    list_filter = ("movement_type", "created_at")
    readonly_fields = ("created_at",)
