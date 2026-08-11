import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/Layout/AppShell'
import { Home } from './pages/Home'
import { SearchPage } from './pages/SearchPage'
import { Delivery } from './pages/Delivery'
import { DeliveryDetail } from './pages/DeliveryDetail'
import { Codes } from './pages/Codes'
import { CodeDetail } from './pages/CodeDetail'
import { Discounts } from './pages/Discounts'
import { Orders } from './pages/Orders'
import { Products } from './pages/Products'
import { Returns } from './pages/Returns'
import { Payment } from './pages/Payment'
import { Systems } from './pages/Systems'
import { Contacts } from './pages/Contacts'
import { Updates } from './pages/Updates'
import { Favorites } from './pages/Favorites'
import { Settings } from './pages/Settings'
import { Showcase } from './pages/Showcase'
import { Team } from './pages/Team'
import { NotFound } from './pages/NotFound'

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/delivery/:id" element={<DeliveryDetail />} />
        <Route path="/codes" element={<Codes />} />
        <Route path="/codes/:id" element={<CodeDetail />} />
        <Route path="/discounts" element={<Discounts />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/products" element={<Products />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/systems" element={<Systems />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/team" element={<Team />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  )
}

export default App
