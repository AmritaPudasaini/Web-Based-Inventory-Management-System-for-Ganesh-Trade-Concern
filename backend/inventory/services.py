
from decimal import Decimal

from django.db.models import Sum
from django.db.models.functions import Coalesce

from .models import StockMovement


def get_stock_balance(product):
    """
    Returns the current stock of a product
    in its base unit.
    """

    movements = StockMovement.objects.filter(
        product=product
    )

    incoming = movements.filter(
        movement_type__in=["opening", "purchase", "adjustment_in"]
    ).aggregate(
        total=Coalesce(Sum("quantity"), Decimal("0"))
    )["total"]

    outgoing = movements.filter(
        movement_type__in=["sale", "adjustment_out"]
    ).aggregate(
        total=Coalesce(Sum("quantity"), Decimal("0"))
    )["total"]

    return incoming - outgoing


from django.db import transaction

from .models import Purchase, PurchaseItem, StockMovement


@transaction.atomic
def complete_purchase(purchase_id):
    """
    Completes a draft purchase and adds its
    quantities to inventory.
    """

    purchase = Purchase.objects.select_for_update().get(
        id=purchase_id
    )

    if purchase.status != "draft":
        raise ValueError(
            "Only draft purchases can be completed."
        )

    items = list(
        PurchaseItem.objects.select_related("product").filter(
            purchase=purchase
        )
    )

    if not items:
        raise ValueError(
            "Cannot complete a purchase without items."
        )

    movements = []

    for item in items:
        product = item.product

        if item.quantity <= 0:
            raise ValueError(
                f"Quantity must be greater than zero for {product.name}."
            )

        if item.unit_price < 0:
            raise ValueError(
                f"Unit price cannot be negative for {product.name}."
            )

        if item.purchase_unit == "carton":
            if product.units_per_carton <= 0:
                raise ValueError(
                    f"Invalid carton conversion for {product.name}."
                )

            conversion_factor = Decimal(
                product.units_per_carton
            )

        elif item.purchase_unit == product.base_unit:
            conversion_factor = Decimal("1")

        else:
            raise ValueError(
                f"Unsupported purchase unit for {product.name}. "
                f"Use cartons or {product.base_unit}."
            )

        base_quantity = (
            item.quantity * conversion_factor
        )

        total_price = (
            item.quantity * item.unit_price
        )

        item.conversion_factor = conversion_factor
        item.base_quantity = base_quantity
        item.total_price = total_price

        item.save(
            update_fields=[
                "conversion_factor",
                "base_quantity",
                "total_price",
            ]
        )

        movements.append(
            StockMovement(
                product=product,
                movement_type="purchase",
                quantity=base_quantity,
                reference=purchase.invoice_number,
                notes=f"Purchase invoice {purchase.invoice_number}",
            )
        )

    StockMovement.objects.bulk_create(movements)

    purchase.status = "completed"
    purchase.save(update_fields=["status"])

    return purchase
