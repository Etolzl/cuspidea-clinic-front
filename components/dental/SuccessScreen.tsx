'use client'

import { useEffect, useState } from 'react'
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  MapPin,
  ExternalLink,
  LayoutDashboard,
  Smile,
  MailOpen,
} from 'lucide-react'
import type { AppointmentData } from './AppointmentWizard'
import * as api from '@/lib/api'

interface SuccessScreenProps {
  appointment: AppointmentData
  onGoToDashboard: () => void
}

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function formatDateDisplay(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(day))
  const dayNames = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
  return `${dayNames[date.getDay()]}, ${day} de ${MONTHS[parseInt(m) - 1]} de ${y}`
}

export default function SuccessScreen({ appointment, onGoToDashboard }: SuccessScreenProps) {
  const [visible, setVisible] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const handleResend = async () => {
    setIsResending(true)
    setResendStatus(null)
    try {
      await api.sendInvitation(appointment.email, appointment.name)
      setResendStatus('¡Invitación reenviada con éxito!')
    } catch (err) {
      setResendStatus('Hubo un error al reenviar. Intenta de nuevo.')
    } finally {
      setIsResending(false)
    }
  }

  const confirmationCode = `DP-${Math.random().toString(36).substring(2,8).toUpperCase()}`

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Smile className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-sm">DentalPro</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">

          {/* Success icon with animation */}
          <div className={[
            'flex flex-col items-center text-center transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          ].join(' ')}>
            <div className="relative mb-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                <MailOpen className="w-10 h-10 text-primary animate-bounce" strokeWidth={1.5} />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">¡Cita confirmada, {appointment.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              Hemos enviado un enlace de activación a <strong className="text-foreground">{appointment.email}</strong>. Revisa tu bandeja de entrada (y la carpeta de spam) para crear tu contraseña y acceder a tu portal.
            </p>

            <div className="mt-5 w-full bg-slate-surface border border-border rounded-2xl p-4 text-center space-y-3 shadow-sm">
              <p className="text-sm font-medium text-foreground">
                ¿No recibiste el correo?
              </p>
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-primary text-sm font-semibold hover:underline disabled:opacity-50"
              >
                {isResending ? 'Reenviando...' : 'Reenviar invitación'}
              </button>
              {resendStatus && (
                <p className="text-xs text-success">{resendStatus}</p>
              )}
            </div>
          </div>

          {/* Booking Summary Card */}
          <div className={[
            'bg-card border border-border rounded-2xl overflow-hidden shadow-sm transition-all duration-700 delay-150',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          ].join(' ')}>
            <div className="bg-primary px-5 py-3">
              <p className="text-primary-foreground/80 text-xs font-medium uppercase tracking-widest">Resumen de tu cita</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-teal-light rounded-lg flex items-center justify-center shrink-0">
                  <Smile className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Servicio</p>
                  <p className="font-semibold text-foreground text-sm">{appointment.service}</p>
                </div>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-teal-light rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fecha</p>
                  <p className="font-semibold text-foreground text-sm">{formatDateDisplay(appointment.date)}</p>
                </div>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-teal-light rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hora</p>
                  <p className="font-semibold text-foreground text-sm">{appointment.time} hrs</p>
                </div>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-teal-light rounded-lg flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dentista asignado</p>
                  <p className="font-semibold text-foreground text-sm">Dra. Sofía Ramírez</p>
                </div>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-teal-light rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ubicación</p>
                  <p className="font-semibold text-foreground text-sm">Av. Insurgentes Sur 1234, CDMX</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className={[
            'space-y-3 transition-all duration-700 delay-300',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          ].join(' ')}>
            <button
              onClick={onGoToDashboard}
              className="w-full py-3.5 rounded-xl font-bold text-primary-foreground bg-primary hover:bg-teal-dark transition-smooth flex items-center justify-center gap-2 shadow-md"
            >
              <LayoutDashboard className="w-4 h-4" />
              Ir a mi Portal de Paciente
            </button>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="#"
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-foreground bg-card border border-border hover:bg-slate-surface transition-smooth"
              >
                <Calendar className="w-4 h-4 text-primary" />
                Google Calendar
              </a>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-foreground bg-card border border-border hover:bg-slate-surface transition-smooth"
              >
                <ExternalLink className="w-4 h-4 text-primary" />
                Cómo llegar
              </a>
            </div>

            <p className="text-center text-xs text-muted-foreground pt-2">
              Si necesitas cancelar o modificar tu cita, puedes hacerlo desde tu portal hasta 24 horas antes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
