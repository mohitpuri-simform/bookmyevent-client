import { Route, Routes } from 'react-router-dom'
import { GuestRoute } from './components/GuestRoute'
import { HomeRoute } from './components/HomeRoute'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { routes } from './constants/routes'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { BookingDetailPage } from './pages/bookings/BookingDetailPage'
import { MyBookingsPage } from './pages/bookings/MyBookingsPage'
import { CheckoutPage } from './pages/checkout/CheckoutPage'
import { EventListPage } from './pages/events/EventListPage'
import { EventSeatMapPage } from './pages/events/EventSeatMapPage'
import { HomePage } from './pages/home/HomePage'
import { CreateEventPage } from './pages/organizer/CreateEventPage'
import { EditEventPage } from './pages/organizer/EditEventPage'
import { EventSectionsPage } from './pages/organizer/EventSectionsPage'
import { OrganizerBookingsPage } from './pages/organizer/OrganizerBookingsPage'
import { OrganizerEventsPage } from './pages/organizer/OrganizerEventsPage'
import { WalletPage } from './pages/organizer/WalletPage'
import { ProfilePage } from './pages/profile/ProfilePage'
import { ROLES } from './shared/constants/auth/role'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<HomeRoute />}>
          <Route path={routes.home} element={<HomePage />} />
        </Route>

        <Route element={<GuestRoute />}>
          <Route path={routes.auth.login} element={<LoginPage />} />
          <Route path={routes.auth.register} element={<RegisterPage />} />
          <Route path={routes.auth.forgotPassword} element={<ForgotPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={routes.profile} element={<ProfilePage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.USER]} />}>
          <Route path={routes.events.list} element={<EventListPage />} />
          <Route path={routes.events.detail(':eventId')} element={<EventSeatMapPage />} />
          <Route path={routes.checkout} element={<CheckoutPage />} />
          <Route path={routes.bookings.list} element={<MyBookingsPage />} />
          <Route path={routes.bookings.detail(':bookingId')} element={<BookingDetailPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.ORGANISER]} />}>
          <Route path={routes.organizer.events} element={<OrganizerEventsPage />} />
          <Route path={routes.organizer.createEvent} element={<CreateEventPage />} />
          <Route path={routes.organizer.editEvent(':eventId')} element={<EditEventPage />} />
          <Route
            path={routes.organizer.eventSections(':eventId')}
            element={<EventSectionsPage />}
          />
          <Route
            path={routes.organizer.eventBookings(':eventId')}
            element={<OrganizerBookingsPage />}
          />
          <Route path={routes.organizer.wallet} element={<WalletPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
