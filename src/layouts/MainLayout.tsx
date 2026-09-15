import { Outlet } from 'react-router-dom'
import { Header } from '@/components/header/Header'
import { Footer } from '@/components/footer/Footer'
import { MobileBottomNav } from '@/components/header/MobileBottomNav'
import { WhatsAppFloatingButton } from '@/components/common/WhatsAppFloatingButton'

export function MainLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <WhatsAppFloatingButton />
    </div>
  )
}
