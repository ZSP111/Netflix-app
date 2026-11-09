import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import { ProfileProvider } from './context/ProfileContext'
import { GuestOnly, RequireAuth, RequireProfile } from './components/Layout/Guards'
import Layout from './components/Layout/Layout'
import Login from './pages/Login/Login'
import Profiles from './pages/Profiles/Profiles'
import Browse from './pages/Browse/Browse'
import MyList from './pages/MyList/MyList'
import Search from './pages/Search/Search'
import Languages from './pages/Languages/Languages'
import Player from './pages/Player/Player'
import Info from './pages/Info/Info'
import NotFound from './pages/NotFound/NotFound'

const App = () => (
  <AuthProvider>
    <ProfileProvider>
      <ToastContainer theme="dark" position="bottom-right" />
      <Routes>
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/profiles" element={<Profiles />} />
          <Route element={<RequireProfile />}>
            <Route path="/watch/:type/:id" element={<Player />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/browse" replace />} />
              <Route path="/browse" element={<Browse page="home" />} />
              <Route path="/browse/tv" element={<Browse key="tv" page="tv" />} />
              <Route path="/browse/movies" element={<Browse key="movies" page="movies" />} />
              <Route path="/latest" element={<Browse key="latest" page="latest" />} />
              <Route path="/kids" element={<Browse key="kids" page="kids" />} />
              <Route path="/my-list" element={<MyList />} />
              <Route path="/search" element={<Search />} />
              <Route path="/languages" element={<Languages />} />
              <Route path="/info" element={<Info />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ProfileProvider>
  </AuthProvider>
)

export default App
