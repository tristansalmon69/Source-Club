import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/layout/Layout'
import { AuthLayout } from './components/layout/AuthLayout'
import { Login } from './pages/auth/Login'
import { Signup } from './pages/auth/Signup'
import { AuthCallback } from './pages/auth/Callback'
import { Dashboard } from './pages/Dashboard'
import { MySources } from './pages/MySources'
import { CreateClub } from './pages/clubs/CreateClub'
import { JoinClub } from './pages/clubs/JoinClub'
import { ClubDetail } from './pages/clubs/ClubDetail'
import { Profile } from './pages/Profile'
import { ShareTarget } from './pages/ShareTarget'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="callback" element={<AuthCallback />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/my-sources" element={<MySources />} />
              <Route path="/clubs/new" element={<CreateClub />} />
              <Route path="/clubs/join" element={<JoinClub />} />
              <Route path="/clubs/:clubId" element={<ClubDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/share" element={<ShareTarget />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
