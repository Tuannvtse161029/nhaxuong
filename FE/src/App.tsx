import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { PropertyProvider } from '@/context/PropertyContext'
import { AppRoutes } from '@/routes/AppRoutes'

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <PropertyProvider>
            <AppRoutes />
          </PropertyProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
