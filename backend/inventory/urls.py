
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet,
    SupplierViewSet,
    CustomerViewSet,
    ProductViewSet,
    PurchaseViewSet,
    SaleViewSet,
    StockViewSet,
)


router = DefaultRouter()

router.register("categories", CategoryViewSet, basename="category")
router.register("suppliers", SupplierViewSet, basename="supplier")
router.register("customers", CustomerViewSet, basename="customer")
router.register("products", ProductViewSet, basename="product")
router.register("purchases", PurchaseViewSet, basename="purchase")
router.register("sales", SaleViewSet, basename="sale")
router.register("stock", StockViewSet, basename="stock")

urlpatterns = router.urls
