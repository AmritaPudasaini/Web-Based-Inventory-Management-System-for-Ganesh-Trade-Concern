
from django.db import models


# ==========================================
# 1. CATEGORY
# ==========================================

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


# ==========================================
# 2. SUPPLIER
# ==========================================

class Supplier(models.Model):
    company_name = models.CharField(max_length=200)
    contact_person = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    pan_number = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["company_name"]

    def __str__(self):
        return self.company_name


# ==========================================
# 3. CUSTOMER
# ==========================================

class Customer(models.Model):
    shop_name = models.CharField(max_length=200)
    contact_person = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    pan_number = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["shop_name"]

    def __str__(self):
        return self.shop_name


# ==========================================
# 4. PRODUCT
# ==========================================

class Product(models.Model):

    BASE_UNIT_CHOICES = [
        ("bottle", "Bottle"),
        ("piece", "Piece"),
        ("packet", "Packet"),
        ("kg", "Kilogram"),
        ("liter", "Liter"),
    ]

    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50, unique=True)
    brand = models.CharField(max_length=100, blank=True)

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
    )

    base_unit = models.CharField(
        max_length=20,
        choices=BASE_UNIT_CHOICES,
        default="bottle",
    )

    units_per_carton = models.PositiveIntegerField(default=12)

    purchase_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    selling_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.sku})"


# ==========================================
# 5. PURCHASE
# ==========================================

class Purchase(models.Model):

    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    invoice_number = models.CharField(
        max_length=100,
        unique=True,
    )

    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.PROTECT,
        related_name="purchases",
    )

    purchase_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft",
    )

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-purchase_date", "-id"]

    def __str__(self):
        return self.invoice_number


# ==========================================
# 6. PURCHASE ITEM
# ==========================================

class PurchaseItem(models.Model):

    UNIT_CHOICES = [
        ("carton", "Carton"),
        ("bottle", "Bottle"),
        ("piece", "Piece"),
        ("packet", "Packet"),
        ("kg", "Kilogram"),
        ("liter", "Liter"),
    ]

    purchase = models.ForeignKey(
        Purchase,
        on_delete=models.CASCADE,
        related_name="items",
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="purchase_items",
    )

    quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    purchase_unit = models.CharField(
        max_length=20,
        choices=UNIT_CHOICES,
    )

    conversion_factor = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    base_quantity = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
    )

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    total_price = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
    )

    def __str__(self):
        return f"{self.product.name} - {self.purchase.invoice_number}"


# ==========================================
# 7. SALE
# ==========================================

class Sale(models.Model):

    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    invoice_number = models.CharField(
        max_length=100,
        unique=True,
    )

    customer = models.ForeignKey(
        Customer,
        on_delete=models.PROTECT,
        related_name="sales",
    )

    sale_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="draft",
    )

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-sale_date", "-id"]

    def __str__(self):
        return self.invoice_number


# ==========================================
# 8. SALE ITEM
# ==========================================

class SaleItem(models.Model):

    UNIT_CHOICES = [
        ("carton", "Carton"),
        ("bottle", "Bottle"),
        ("piece", "Piece"),
        ("packet", "Packet"),
        ("kg", "Kilogram"),
        ("liter", "Liter"),
    ]

    sale = models.ForeignKey(
        Sale,
        on_delete=models.CASCADE,
        related_name="items",
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="sale_items",
    )

    quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    sale_unit = models.CharField(
        max_length=20,
        choices=UNIT_CHOICES,
    )

    conversion_factor = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    base_quantity = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
    )

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    total_price = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
    )

    def __str__(self):
        return f"{self.product.name} - {self.sale.invoice_number}"

# ==========================================
# 7. STOCK MOVEMENT
# ==========================================

class StockMovement(models.Model):

    MOVEMENT_TYPES = [
        ("opening", "Opening Stock"),
        ("purchase", "Purchase"),
        ("sale", "Sale"),
        ("adjustment_in", "Stock Adjustment In"),
        ("adjustment_out", "Stock Adjustment Out"),
    ]

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="stock_movements",
    )

    movement_type = models.CharField(
        max_length=20,
        choices=MOVEMENT_TYPES,
    )

    quantity = models.DecimalField(
        max_digits=14,
        decimal_places=2,
    )

    reference = models.CharField(
        max_length=100,
        blank=True,
    )

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "-id"]

    def __str__(self):
        return f"{self.product.name} - {self.movement_type}"
