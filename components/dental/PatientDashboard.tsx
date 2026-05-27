'use client'

import { useState } from 'react'
import {
  Calendar,
  Clock,
  FileText,
  FolderOpen,
  User,
  Bell,
  Edit,
  X,
  ChevronRight,
  Plus,
  Activity,
  CreditCard,
  ImageIcon,
  Smile,
  Menu,
  LogOut,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'
import type { AppointmentData } from './AppointmentWizard'

interface PatientDashboardProps {
  appointment: AppointmentData | null
  onNewAppointment: () => void
  onLogout: () => void
}

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
function formatDateDisplay(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${day} de ${MONTHS[parseInt(m) - 1]} de ${y}`
}

const NAV_ITEMS = [
  { id: 'citas', label: 'Citas', icon: Calendar },
  { id: 'historial', label: 'Historial Clínico', icon: Activity },
  { id: 'documentos', label: 'Documentos', icon: FolderOpen },
  { id: 'cuenta', label: 'Mi Cuenta', icon: User },
]

const HISTORY_RECORDS = [
  { date: '12 Mar 2025', service: 'Limpieza Dental', doctor: 'Dra. Ramírez', status: 'completed', notes: 'Sin caries detectadas. Higiene oral buena.' },
  { date: '05 Ene 2025', service: 'Consulta General', doctor: 'Dra. Ramírez', status: 'completed', notes: 'Revisión de rutina. Se recomendó blanqueamiento.' },
  { date: '20 Oct 2024', service: 'Ortodoncia', doctor: 'Dra. Ramírez', status: 'completed', notes: 'Ajuste mensual de brackets. Progreso óptimo.' },
]

const XRAY_RECORDS = [
  { name: 'Radiografía Panorámica', date: 'Mar 2025', size: '2.4 MB' },
  { name: 'Rx. Periapical #14', date: 'Ene 2025', size: '840 KB' },
  { name: 'Rx. Periapical #24', date: 'Oct 2024', size: '912 KB' },
]

const BILLING = [
  { concept: 'Limpieza Dental', date: '12 Mar 2025', amount: '$650', status: 'paid' },
  { concept: 'Consulta General', date: '05 Ene 2025', amount: '$450', status: 'paid' },
  { concept: 'Ajuste Ortodoncia', date: '20 Oct 2024', amount: '$800', status: 'paid' },
]

function CancelModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-sm shadow-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Cancelar cita</h3>
            <p className="text-sm text-muted-foreground">Esta acción no se puede deshacer</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          ¿Estás seguro de que deseas cancelar tu próxima cita? Si cambias de opinión, puedes agendar una nueva cita desde el portal.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-foreground bg-muted hover:bg-slate-surface transition-smooth border border-border">
            Mantener cita
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground bg-destructive hover:bg-destructive/90 transition-smooth">
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PatientDashboard({ appointment, onNewAppointment, onLogout }: PatientDashboardProps) {
  const [activeNav, setActiveNav] = useState('citas')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [appointmentCancelled, setAppointmentCancelled] = useState(false)

  const handleCancelConfirm = () => {
    setAppointmentCancelled(true)
    setShowCancelModal(false)
  }

  const upcomingAppointment = appointment && !appointmentCancelled ? appointment : null

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={[
        'fixed top-0 left-0 bottom-0 z-40 w-64 bg-sidebar flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}>
        {/* Logo */}
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Smile className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="font-bold text-sidebar-foreground text-sm">DentalPro</p>
              <p className="text-xs text-sidebar-foreground/50">Portal del Paciente</p>
            </div>
          </div>
        </div>

        {/* Patient info */}
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">
                {appointment?.name || 'Paciente Demo'}
              </p>
              <p className="text-xs text-sidebar-foreground/50 truncate">
                {appointment?.email || 'paciente@correo.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveNav(item.id); setSidebarOpen(false) }}
              className={[
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth',
                activeNav === item.id
                  ? 'bg-sidebar-accent text-sidebar-foreground'
                  : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
              ].join(' ')}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
              {item.id === 'citas' && upcomingAppointment && (
                <span className="ml-auto w-2 h-2 bg-accent rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground transition-smooth"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-card border-b border-border sticky top-0 z-20">
          <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-surface text-muted-foreground transition-smooth"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="font-semibold text-foreground text-sm">
                  {NAV_ITEMS.find(n => n.id === activeNav)?.label}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-lg hover:bg-slate-surface text-muted-foreground transition-smooth">
                <Bell className="w-4 h-4" />
                {upcomingAppointment && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
                )}
              </button>
              <button
                onClick={onNewAppointment}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-teal-dark rounded-lg transition-smooth"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Nueva Cita</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 space-y-6">

          {/* CITAS TAB */}
          {activeNav === 'citas' && (
            <div className="space-y-6">
              {/* Upcoming appointment banner */}
              {upcomingAppointment ? (
                <div className="bg-card border border-primary/30 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-primary px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      <p className="text-primary-foreground font-semibold text-sm">Próxima cita confirmada</p>
                    </div>
                    <span className="text-primary-foreground/70 text-xs font-mono">
                      {`DP-${Math.random().toString(36).substring(2,8).toUpperCase()}`}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Servicio</p>
                          <p className="font-semibold text-foreground text-sm">{upcomingAppointment.service}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Fecha</p>
                          <p className="font-semibold text-foreground text-sm">{formatDateDisplay(upcomingAppointment.date)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Hora</p>
                          <p className="font-semibold text-foreground text-sm">{upcomingAppointment.time} hrs</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Dentista</p>
                          <p className="font-semibold text-foreground text-sm">Dra. Ramírez</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={onNewAppointment}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-teal-light transition-smooth"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Modificar
                        </button>
                        <button
                          onClick={() => setShowCancelModal(true)}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-smooth"
                        >
                          <X className="w-3.5 h-3.5" />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Sin citas próximas</h3>
                  <p className="text-sm text-muted-foreground mb-4">Agenda tu próxima visita dental para mantener tu salud bucal.</p>
                  <button
                    onClick={onNewAppointment}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-teal-dark rounded-xl transition-smooth"
                  >
                    <Plus className="w-4 h-4" />
                    Agendar Cita
                  </button>
                </div>
              )}

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground font-medium">Total de citas</p>
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{upcomingAppointment ? 4 : 3}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">en el último año</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground font-medium">Próx. revisión</p>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">Jun</p>
                  <p className="text-xs text-muted-foreground mt-0.5">2025 recomendado</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground font-medium">Saldo pendiente</p>
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold text-accent">$0</p>
                  <p className="text-xs text-muted-foreground mt-0.5">todo al corriente</p>
                </div>
              </div>
            </div>
          )}

          {/* HISTORIAL TAB */}
          {activeNav === 'historial' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Historial de visitas</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {HISTORY_RECORDS.length} registros
                </div>
              </div>
              <div className="space-y-3">
                {HISTORY_RECORDS.map((r, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-smooth">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-success-muted rounded-xl flex items-center justify-center shrink-0">
                          <CheckCircle className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{r.service}</p>
                          <p className="text-xs text-muted-foreground">{r.doctor} · {r.date}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-1 bg-success-muted text-accent text-xs font-medium rounded-full">
                        Completada
                      </span>
                    </div>
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground font-medium mb-1">Notas del doctor</p>
                      <p className="text-sm text-foreground">{r.notes}</p>
                    </div>
                    <button className="mt-3 text-xs text-primary flex items-center gap-1 hover:gap-2 transition-all">
                      Ver receta y tratamiento <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DOCUMENTOS TAB */}
          {activeNav === 'documentos' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">Radiografías digitales</h3>
                  <button className="text-xs text-primary flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Solicitar nueva
                  </button>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {XRAY_RECORDS.map((r, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-sm transition-smooth group">
                      <div className="h-28 bg-foreground/5 flex items-center justify-center relative">
                        <div className="w-full h-full bg-gradient-to-br from-foreground/5 to-foreground/10 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-smooth flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="text-xs text-primary font-medium bg-card px-2 py-1 rounded">Ver imagen</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-foreground">{r.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">{r.date}</p>
                          <p className="text-xs text-muted-foreground">{r.size}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Documentos y recetas</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Receta Médica – Mar 2025', type: 'PDF', date: '12 Mar 2025' },
                    { name: 'Plan de Tratamiento Ortodoncia', type: 'PDF', date: '05 Ene 2025' },
                    { name: 'Consentimiento Informado', type: 'PDF', date: '20 Oct 2024' },
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-smooth">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-teal-light rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.type} · {doc.date}</p>
                        </div>
                      </div>
                      <button className="text-xs text-primary flex items-center gap-1 hover:gap-2 transition-all">
                        Descargar <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CUENTA TAB */}
          {activeNav === 'cuenta' && (
            <div className="space-y-6 max-w-lg">
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-teal-light flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{appointment?.name || 'Paciente Demo'}</h3>
                    <p className="text-muted-foreground text-sm">{appointment?.email || 'paciente@correo.com'}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success-muted text-accent text-xs font-medium rounded-full mt-1">
                      <CheckCircle className="w-3 h-3" /> Cuenta activa
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Nombre completo', value: appointment?.name || 'Paciente Demo' },
                    { label: 'Correo electrónico', value: appointment?.email || 'paciente@correo.com' },
                    { label: 'Teléfono', value: appointment?.phone || '+52 (55) 1234-5678' },
                    { label: 'Fecha de registro', value: 'Mayo 2025' },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="text-xs text-muted-foreground">{f.label}</p>
                        <p className="text-sm font-medium text-foreground mt-0.5">{f.value}</p>
                      </div>
                      <button className="text-xs text-primary hover:underline">Editar</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Historial de pagos</h3>
                <div className="space-y-2">
                  {BILLING.map((b, i) => (
                    <div key={i} className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{b.concept}</p>
                          <p className="text-xs text-muted-foreground">{b.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground text-sm">{b.amount}</p>
                        <span className="text-xs text-accent font-medium">Pagado</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <CancelModal
          onConfirm={handleCancelConfirm}
          onCancel={() => setShowCancelModal(false)}
        />
      )}
    </div>
  )
}
