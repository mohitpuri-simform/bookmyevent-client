import { Route, Routes } from 'react-router-dom'
import { GuestRoute } from './components/GuestRoute'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { routes } from './constants/routes'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { HomePage } from './pages/home/HomePage'
import { ProfilePage } from './pages/profile/ProfilePage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={routes.home} element={<HomePage />} />
        <Route element={<GuestRoute />}>
          <Route path={routes.auth.login} element={<LoginPage />} />
          <Route path={routes.auth.register} element={<RegisterPage />} />
          <Route path={routes.auth.forgotPassword} element={<ForgotPasswordPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path={routes.dashboard} element={<DashboardPage />} />
          <Route path={routes.profile} element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
