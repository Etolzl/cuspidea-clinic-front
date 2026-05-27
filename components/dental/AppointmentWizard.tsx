'use client'

import { useState, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Stethoscope,
  Smile,
  Shield,
  Clock,
  User,
  Check,
  X,
  Calendar,
} from 'lucide-react'
import * as api from '@/lib/api'

interface AppointmentWizardProps {
  onComplete: (data: AppointmentData) => void
  onBack: () => void
}

export interface AppointmentData {
  service: string
  date: string
  time: string
  name: string
  phone: string
  email: string
  message: string
  tempPassword?: string
}

const SERVICES = [
  { id: 'limpieza', icon: Sparkles, title: 'Limpieza Dental', desc: 'Profilaxis y eliminación de sarro', duration: '45 min', price: '$650' },
  { id: 'consulta', icon: Stethoscope, title: 'Consulta General', desc: 'Revisión y diagnóstico preventivo', duration: '30 min', price: '$450' },
  { id: 'ortodoncia', icon: Smile, title: 'Ortodoncia', desc: 'Brackets y alineadores Invisalign', duration: '60 min', price: '$800' },
  { id: 'blanqueamiento', icon: Shield, title: 'Blanqueamiento', desc: 'Tratamiento de alta eficacia', duration: '90 min', price: '$1,200' },
  { id: 'implante', icon: Clock, title: 'Implantes Dentales', desc: 'Solución permanente y natural', duration: '120 min', price: '$8,500' },
  { id: 'endodoncia', icon: User, title: 'Endodoncia', desc: 'Tratamiento de conductos radiculares', duration: '90 min', price: '$2,800' },
]

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS_OF_WEEK = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:00', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
]

const STEPS = ['Servicio', 'Horario', 'Confirmar']

function CalendarPicker({ selectedDate, onSelect }: { selectedDate: string; onSelect: (d: string) => void }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const formatDate = (d: number) => `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`

  const isDisabled = (d: number) => {
    const date = new Date(viewYear, viewMonth, d)
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return date < todayMidnight || date.getDay() === 0
  }

  const blanks = Array(firstDay).fill(null)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 hover:bg-slate-surface rounded-lg transition-smooth">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <span className="font-semibold text-foreground text-sm">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="p-1.5 hover:bg-slate-surface rounded-lg transition-smooth">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS_OF_WEEK.map(d => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {blanks.map((_, i) => <div key={`b${i}`} />)}
        {days.map(d => {
          const dateStr = formatDate(d)
          const disabled = isDisabled(d)
          const selected = selectedDate === dateStr
          return (
            <button
              key={d}
              disabled={disabled}
              onClick={() => !disabled && onSelect(dateStr)}
              className={[
                'aspect-square flex items-center justify-center text-sm rounded-lg transition-smooth font-medium',
                disabled ? 'text-muted-foreground/40 cursor-not-allowed' : 'hover:bg-teal-light hover:text-primary cursor-pointer',
                selected ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground' : '',
              ].join(' ')}
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function AppointmentWizard({ onComplete, onBack }: AppointmentWizardProps) {
  const [step, setStep] = useState(0)
  const [selectedService, setSelectedService] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [bookedAppointments, setBookedAppointments] = useState<any[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Cargar citas agendadas al seleccionar una fecha
  useEffect(() => {
    if (!selectedDate) {
      setBookedAppointments([])
      return
    }

    const fetchBooked = async () => {
      setLoadingSlots(true)
      try {
        const res = await api.getCitasByDate(selectedDate)
        setBookedAppointments(res)
      } catch (error) {
        console.error('Error al cargar citas de la fecha:', error)
      } finally {
        setLoadingSlots(false)
      }
    }

    fetchBooked()
  }, [selectedDate])

  const isSlotBooked = (timeSlot: string) => {
    if (!selectedDate || !selectedService) return false
    const [hours, minutes] = timeSlot.split(':').map(Number)
    const [year, month, day] = selectedDate.split('-').map(Number)
    const start = new Date(year, month - 1, day, hours, minutes)
    
    // Obtener duración del servicio
    const durationMap: Record<string, number> = {
      'limpieza': 45,
      'consulta': 30,
      'ortodoncia': 60,
      'blanqueamiento': 90,
      'implante': 120,
      'endodoncia': 90,
    }
    const duration = durationMap[selectedService] || 30
    const end = new Date(start.getTime() + duration * 60 * 1000)

    return bookedAppointments.some(appt => {
      if (appt.estado === 'cancelada' || appt.estado === 'no_asistio') return false
      const apptStart = new Date(appt.fecha_hora_inicio)
      const apptEnd = new Date(appt.fecha_hora_fin)
      return start < apptEnd && end > apptStart
    })
  }

  const isSlotOutOfHours = (timeSlot: string) => {
    if (!selectedDate) return false
    const [year, month, day] = selectedDate.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    const dayOfWeek = date.getDay()

    // Sábados de 9:00 AM a 2:00 PM (14:00)
    if (dayOfWeek === 6) {
      const [hours, minutes] = timeSlot.split(':').map(Number)
      const timeValue = hours * 60 + minutes
      
      const durationMap: Record<string, number> = {
        'limpieza': 45,
        'consulta': 30,
        'ortodoncia': 60,
        'blanqueamiento': 90,
        'implante': 120,
        'endodoncia': 90,
      }
      const duration = durationMap[selectedService] || 30
      
      // La cita no puede extenderse más allá de las 14:00 (840 minutos)
      if (timeValue + duration > 14 * 60) {
        return true
      }
    }
    return false
  }

  const isSlotInPast = (timeSlot: string) => {
    if (!selectedDate) return false
    const today = new Date()
    const [year, month, day] = selectedDate.split('-').map(Number)
    const selectDateObj = new Date(year, month - 1, day)

    if (selectDateObj.toDateString() === today.toDateString()) {
      const [hours, minutes] = timeSlot.split(':').map(Number)
      const slotTimeValue = hours * 60 + minutes
      const currentTimeValue = today.getHours() * 60 + today.getMinutes()
      // Margen mínimo de 30 minutos para agendar hoy
      return slotTimeValue < currentTimeValue + 30
    }
    return false
  }

  const canProceedStep0 = selectedService !== ''
  const canProceedStep1 = selectedDate !== '' && selectedTime !== ''

  const validateStep2 = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Nombre requerido'
    if (!form.phone.trim()) e.phone = 'Teléfono requerido'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Email válido requerido'
    if (!agreed) e.agreed = 'Debes aceptar los términos'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validateStep2()) return
    onComplete({
      service: SERVICES.find(s => s.id === selectedService)?.title ?? selectedService,
      date: selectedDate,
      time: selectedTime,
      ...form,
    })
  }

  const serviceObj = SERVICES.find(s => s.id === selectedService)
  const formatDateDisplay = (d: string) => {
    if (!d) return ''
    const [y, m, day] = d.split('-')
    return `${day} de ${MONTHS[parseInt(m) - 1]} de ${y}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ChevronLeft className="w-4 h-4" />
            Volver
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Smile className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-sm">DentalPro</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Step progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-border -z-0" />
            <div
              className="absolute left-0 top-4 h-0.5 bg-primary transition-all duration-500 -z-0"
              style={{ width: step === 0 ? '0%' : step === 1 ? '50%' : '100%' }}
            />
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-1.5 z-10">
                <div className={[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-smooth',
                  i < step ? 'bg-primary border-primary text-primary-foreground' :
                  i === step ? 'bg-card border-primary text-primary' :
                  'bg-card border-border text-muted-foreground',
                ].join(' ')}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={[
                  'text-xs font-medium hidden sm:block',
                  i === step ? 'text-primary' : i < step ? 'text-foreground' : 'text-muted-foreground',
                ].join(' ')}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 0: Service Selection */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Selecciona un servicio</h1>
              <p className="text-muted-foreground mt-1">¿Qué tipo de atención dental necesitas hoy?</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {SERVICES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(s.id)}
                  className={[
                    'w-full text-left p-4 rounded-xl border-2 transition-smooth',
                    selectedService === s.id
                      ? 'border-primary bg-teal-light'
                      : 'border-border bg-card hover:border-primary/50 hover:bg-slate-surface',
                  ].join(' ')}
                >
                  <div className="flex items-start gap-3">
                    <div className={[
                      'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                      selectedService === s.id ? 'bg-primary' : 'bg-slate-surface',
                    ].join(' ')}>
                      <s.icon className={['w-5 h-5', selectedService === s.id ? 'text-primary-foreground' : 'text-primary'].join(' ')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-foreground text-sm">{s.title}</p>
                        {selectedService === s.id && (
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {s.duration}
                        </span>
                        <span className="text-xs font-semibold text-primary">{s.price}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              disabled={!canProceedStep0}
              onClick={() => setStep(1)}
              className="w-full py-3.5 rounded-xl font-semibold text-primary-foreground bg-primary hover:bg-teal-dark disabled:opacity-40 disabled:cursor-not-allowed transition-smooth flex items-center justify-center gap-2"
            >
              Continuar
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 1: Date & Time */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Elige fecha y horario</h1>
              <p className="text-muted-foreground mt-1">Selecciona cuándo deseas tu cita de <strong className="text-foreground">{serviceObj?.title}</strong></p>
            </div>

            <CalendarPicker selectedDate={selectedDate} onSelect={setSelectedDate} />

            {selectedDate && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <p className="font-medium text-foreground text-sm">{formatDateDisplay(selectedDate)}</p>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {loadingSlots ? (
                    <div className="col-span-full py-8 text-center text-sm text-muted-foreground animate-pulse flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 animate-spin text-primary" />
                      Consultando disponibilidad en tiempo real...
                    </div>
                  ) : (
                    TIME_SLOTS.map(t => {
                      const booked = isSlotBooked(t) || isSlotOutOfHours(t) || isSlotInPast(t)
                      const selected = selectedTime === t
                      return (
                        <button
                          key={t}
                          disabled={booked}
                          onClick={() => !booked && setSelectedTime(t)}
                          className={[
                            'py-2 px-1 rounded-lg text-sm font-medium border transition-smooth',
                            booked ? 'border-border bg-muted text-muted-foreground/35 cursor-not-allowed line-through' :
                            selected ? 'border-primary bg-primary text-primary-foreground' :
                            'border-border bg-card text-foreground hover:border-primary hover:bg-teal-light',
                          ].join(' ')}
                        >
                          {t}
                        </button>
                      )
                    })
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-primary inline-block" /> Seleccionado</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-card border border-border inline-block" /> Disponible</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-muted inline-block" /> Ocupado</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="flex-1 py-3.5 rounded-xl font-medium text-foreground bg-card border border-border hover:bg-slate-surface transition-smooth"
              >
                Atrás
              </button>
              <button
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
                className="flex-[2] py-3.5 rounded-xl font-semibold text-primary-foreground bg-primary hover:bg-teal-dark disabled:opacity-40 disabled:cursor-not-allowed transition-smooth flex items-center justify-center gap-2"
              >
                Continuar
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Registration Form */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tus datos de contacto</h1>
              <p className="text-muted-foreground mt-1">Completa tu información para confirmar la cita</p>
            </div>

            {/* Summary mini-card */}
            <div className="bg-teal-light border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Tu cita</p>
                <p className="font-semibold text-foreground">{serviceObj?.title}</p>
                <p className="text-sm text-muted-foreground">{formatDateDisplay(selectedDate)} · {selectedTime}</p>
              </div>
              <button onClick={() => setStep(0)} className="text-xs text-primary underline self-start sm:self-center">
                Modificar
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Nombre completo <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })) }}
                  placeholder="María García López"
                  className={[
                    'w-full px-4 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground text-sm transition-smooth outline-none',
                    errors.name ? 'border-destructive focus:ring-2 focus:ring-destructive/30' : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20',
                  ].join(' ')}
                />
                {errors.name && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><X className="w-3 h-3" />{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Teléfono <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: '' })) }}
                  placeholder="+52 (55) 1234-5678"
                  className={[
                    'w-full px-4 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground text-sm transition-smooth outline-none',
                    errors.phone ? 'border-destructive focus:ring-2 focus:ring-destructive/30' : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20',
                  ].join(' ')}
                />
                {errors.phone && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><X className="w-3 h-3" />{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Correo electrónico <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })) }}
                  placeholder="maria@correo.com"
                  className={[
                    'w-full px-4 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground text-sm transition-smooth outline-none',
                    errors.email ? 'border-destructive focus:ring-2 focus:ring-destructive/30' : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20',
                  ].join(' ')}
                />
                {errors.email && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><X className="w-3 h-3" />{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Mensaje o notas adicionales
                </label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Describe brevemente tu situación o preguntas..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm transition-smooth outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              <label className={[
                'flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-smooth',
                errors.agreed ? 'border-destructive bg-destructive/5' : 'border-border hover:border-primary/50 hover:bg-slate-surface',
              ].join(' ')}>
                <div
                  onClick={() => { setAgreed(a => !a); setErrors(er => ({ ...er, agreed: '' })) }}
                  className={[
                    'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-smooth',
                    agreed ? 'bg-primary border-primary' : 'border-border bg-card',
                  ].join(' ')}
                >
                  {agreed && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <span className="text-sm text-foreground leading-relaxed">
                  Acepto los{' '}
                  <a href="#" className="text-primary underline">términos y condiciones</a>
                  {' '}y deseo crear mi cuenta de paciente en DentalPro
                </span>
              </label>
              {errors.agreed && <p className="text-xs text-destructive flex items-center gap-1"><X className="w-3 h-3" />{errors.agreed}</p>}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 rounded-xl font-medium text-foreground bg-card border border-border hover:bg-slate-surface transition-smooth"
              >
                Atrás
              </button>
              <button
                onClick={handleSubmit}
                className="flex-[2] py-3.5 rounded-xl font-bold text-primary-foreground bg-primary hover:bg-teal-dark transition-smooth flex items-center justify-center gap-2 shadow-md"
              >
                <Check className="w-4 h-4" />
                Confirmar Cita
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
