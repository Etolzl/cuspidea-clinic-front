'use client'

import { useState, useEffect } from 'react'
import LandingPage from '@/components/dental/LandingPage'
import AppointmentWizard, { type AppointmentData } from '@/components/dental/AppointmentWizard'
import SuccessScreen from '@/components/dental/SuccessScreen'
import PatientDashboard from '@/components/dental/PatientDashboard'
import LoginForm from '@/components/dental/LoginForm'
import * as api from '@/lib/api'

type View = 'landing' | 'login' | 'wizard' | 'success' | 'dashboard'

interface LoggedUser {
  id: string
  email: string
  nombre_completo: string
  telefono?: string
  token: string
}

export default function Page() {
  const [view, setView] = useState<View>('landing')
  const [appointment, setAppointment] = useState<AppointmentData | null>(null)
  const [user, setUser] = useState<LoggedUser | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Detectar si Supabase redirigió aquí con un token de recovery en el hash
  // y redirigir automáticamente a /reset-password conservando el hash
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      const type = params.get('type')
      const accessToken = params.get('access_token')
      const error = params.get('error')

      if ((type === 'recovery' && accessToken) || error) {
        // Redirigir a /reset-password manteniendo el hash con el token
        window.location.href = `/reset-password${window.location.hash}`
        return
      }
    }
  }, [])

  // Abrir la vista correspondiente si viene como parámetro de consulta (?view=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const viewParam = params.get('view')
      if (viewParam && ['landing', 'login', 'wizard', 'success', 'dashboard'].includes(viewParam)) {
        setView(viewParam as View)
        // Limpiar parámetros de la URL para una experiencia más limpia
        window.history.replaceState(null, '', window.location.pathname)
      }
    }
  }, [])


  const handleViewChange = (newView: View) => {
    setView(newView)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' })
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname)
      }
    }
  }

  // Genera una contraseña segura temporal
  const generateTempPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let pass = ''
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return `Temp_${pass}!1`
  }

  const handleWizardComplete = async (data: AppointmentData) => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. Generar contraseña temporal
      const tempPassword = generateTempPassword()

      // 2. Registrar usuario en API
      const registerRes = await api.register({
        email: data.email,
        password: tempPassword,
        nombre_completo: data.name,
        telefono: data.phone,
        rol: 'paciente',
      })

      const perfilId = registerRes.user.perfil.id

      // 3. Login en API
      const loginRes = await api.login(data.email, tempPassword)
      const token = loginRes.session.access_token

      // 4. Crear paciente
      const pacienteRes = await api.createPaciente(token, {
        nombre_completo: data.name,
        correo: data.email,
        telefono: data.phone,
        perfil_id: perfilId,
      })

      const pacienteId = pacienteRes.id

      // 5. Obtener primer dentista
      const dentistas = await api.getDentistas()
      if (!dentistas || dentistas.length === 0) {
        throw new Error('No hay dentistas disponibles en el sistema.')
      }
      const dentistaId = dentistas[0].id

      // 6. Calcular horas de inicio y fin
      const start = new Date(`${data.date}T${data.time}:00`)
      const durationMap: Record<string, number> = {
        'Limpieza Dental': 45,
        'Consulta General': 30,
        'Ortodoncia': 60,
        'Blanqueamiento': 90,
        'Implantes Dentales': 120,
        'Endodoncia': 90,
      }
      const duration = durationMap[data.service] || 30
      const end = new Date(start.getTime() + duration * 60 * 1000)

      // 7. Crear la cita
      await api.createCita(token, {
        paciente_id: pacienteId,
        dentista_id: dentistaId,
        fecha_hora_inicio: start.toISOString(),
        fecha_hora_fin: end.toISOString(),
        motivo_consulta: data.service,
      })

      // Guardar usuario logueado en estado y localStorage
      const loggedUser: LoggedUser = {
        id: perfilId,
        email: data.email,
        nombre_completo: data.name,
        telefono: data.phone,
        token,
      }
      setUser(loggedUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_session', JSON.stringify(loggedUser))
      }

      setAppointment({
        ...data,
        tempPassword,
      })
      handleViewChange('success')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Error al procesar la cita y registro')
      alert(err.message || 'Ocurrió un error al procesar el registro y la cita')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginSuccess = (userData: any) => {
    const loggedUser: LoggedUser = {
      id: userData.user.id,
      email: userData.user.email,
      nombre_completo: userData.user.perfil?.nombre_completo || 'Paciente',
      telefono: userData.user.perfil?.telefono || '',
      token: userData.session.access_token,
    }
    setUser(loggedUser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_session', JSON.stringify(loggedUser))
    }
    handleViewChange('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    setAppointment(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_session')
    }
    handleViewChange('landing')
  }

  return (
    <>
      {view === 'landing' && (
        <LandingPage
          onBookAppointment={() => handleViewChange('wizard')}
          onLogin={() => handleViewChange('login')}
        />
      )}

      {view === 'login' && (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onBack={() => handleViewChange('landing')}
        />
      )}

      {view === 'wizard' && (
        <AppointmentWizard
          onComplete={handleWizardComplete}
          onBack={() => handleViewChange('landing')}
        />
      )}

      {view === 'success' && appointment && (
        <SuccessScreen
          appointment={appointment}
          onGoToDashboard={() => handleViewChange('dashboard')}
        />
      )}

      {view === 'dashboard' && (
        <PatientDashboard
          appointment={appointment || (user ? {
            service: 'Ver en portal',
            date: '',
            time: '',
            name: user.nombre_completo,
            email: user.email,
            phone: user.telefono || '',
            message: '',
          } : null)}
          onNewAppointment={() => handleViewChange('wizard')}
          onLogout={handleLogout}
        />
      )}
    </>
  )
}
