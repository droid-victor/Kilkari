import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { HomePage } from '@/pages/HomePage'
import { ShopPage } from '@/pages/ShopPage'
import { ProductPage } from '@/pages/ProductPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage'
import { TrackOrderPage } from '@/pages/TrackOrderPage'
import { WishlistPage } from '@/pages/WishlistPage'
import { SearchPage } from '@/pages/SearchPage'
import { StorePage } from '@/pages/StorePage'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { FAQPage } from '@/pages/FAQPage'
import { SizeGuidePage } from '@/pages/SizeGuidePage'
import { ReturnsPage } from '@/pages/ReturnsPage'
import { AccountPage } from '@/pages/AccountPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { AddressesPage } from '@/pages/AddressesPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { TermsPage } from '@/pages/TermsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AdminGuard } from '@/components/common/AdminGuard'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminProductListPage } from '@/pages/admin/AdminProductListPage'
import { AdminProductFormPage } from '@/pages/admin/AdminProductFormPage'
import { AdminSalesPage } from '@/pages/admin/AdminSalesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />

          <Route path="shop" element={<ShopPage title="Shop All" />} />
          <Route path="boys" element={<ShopPage title="Boys" gender="boys" />} />
          <Route path="girls" element={<ShopPage title="Girls" gender="girls" />} />
          <Route path="baby" element={<ShopPage title="Baby" gender="baby" />} />
          <Route path="clothing" element={<ShopPage title="Clothing" category="clothing" />} />
          <Route path="footwear" element={<ShopPage title="Footwear" category="footwear" />} />
          <Route path="toys" element={<ShopPage title="Toys" category="toys" />} />
          <Route path="accessories" element={<ShopPage title="Accessories" category="accessories" />} />
          <Route
            path="sale"
            element={<ShopPage title="Sale" description="Great deals across clothing, footwear and toys." saleOnly />}
          />
          <Route
            path="birthday"
            element={<ShopPage title="Birthday Ready" description="Party wear, shoes and gifts for the big day." />}
          />
          <Route
            path="school"
            element={<ShopPage title="Back to School" category="footwear" description="School shoes and back-to-school essentials." />}
          />
          <Route
            path="newborn"
            element={<ShopPage title="Welcome, Little One" gender="baby" description="Everything for your newborn." />}
          />

          <Route path="search" element={<SearchPage />} />
          <Route path="product/:slug" element={<ProductPage />} />

          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="track-order" element={<TrackOrderPage />} />
          <Route path="wishlist" element={<WishlistPage />} />

          <Route path="account" element={<AccountPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="returns" element={<ReturnsPage />} />
          <Route path="size-guide" element={<SizeGuidePage />} />

          <Route path="store" element={<StorePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route
          path="admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductListPage />} />
          <Route path="products/new" element={<AdminProductFormPage />} />
          <Route path="products/:id" element={<AdminProductFormPage />} />
          <Route path="sales" element={<AdminSalesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
