import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/Layout/AppShell'
import { Home } from './pages/Home'
import { SearchPage } from './pages/SearchPage'
import { Delivery } from './pages/Delivery'
import { DeliveryDetail } from './pages/DeliveryDetail'
import { Discounts } from './pages/Discounts'
import { Orders } from './pages/Orders'
import { Returns } from './pages/Returns'
import { Payment } from './pages/Payment'
import { Systems } from './pages/Systems'
import { Contacts } from './pages/Contacts'
import { Updates } from './pages/Updates'
import { Favorites } from './pages/Favorites'
import { Settings } from './pages/Settings'
import { Showcase } from './pages/Showcase'
import { Resurs } from './pages/Resurs'
import { Team } from './pages/Team'
import { Notes } from './pages/Notes'
import { OfferPage } from './features/offers/pages/OfferPage'
import { NotFound } from './pages/NotFound'
import { PlaceholderPage } from './pages/PlaceholderPage'

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resurs" element={<Resurs />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/delivery/:id" element={<DeliveryDetail />} />
        <Route path="/discounts" element={<Discounts />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/systems" element={<Systems />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/products" element={<Showcase />} />
        <Route path="/team" element={<Team />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/offert" element={<OfferPage />} />
        <Route path="/customers" element={<PlaceholderPage title="Kunder" />} />
        <Route path="/prices" element={<PlaceholderPage title="Priser" />} />
        <Route path="/reclamations" element={<PlaceholderPage title="Reklamationer" />} />
        <Route path="/help" element={<PlaceholderPage title="Hjälp" />} />
        <Route path="/notifications" element={<PlaceholderPage title="Notiser" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  )
}

export default App
