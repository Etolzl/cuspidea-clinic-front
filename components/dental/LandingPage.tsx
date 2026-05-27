'use client'

import Image from 'next/image'
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Star,
  Shield,
  Award,
  ChevronRight,
  Stethoscope,
  Sparkles,
  Smile,
} from 'lucide-react'

interface LandingPageProps {
  onBookAppointment: () => void
  onLogin: () => void
}

const services = [
  { icon: Sparkles, title: 'Limpieza Dental', desc: 'Profilaxis profesional y eliminación de sarro' },
  { icon: Stethoscope, title: 'Consulta General', desc: 'Revisión completa y diagnóstico preventivo' },
  { icon: Smile, title: 'Ortodoncia', desc: 'Brackets metálicos, cerámicos y alineadores' },
  { icon: Shield, title: 'Blanqueamiento', desc: 'Tratamiento de alta eficacia y larga duración' },
]

const stats = [
  { value: '12+', label: 'Años de experiencia' },
  { value: '3,400+', label: 'Pacientes atendidos' },
  { value: '98%', label: 'Satisfacción' },
  { value: '5', label: 'Especialistas' },
]

export default function LandingPage({ onBookAppointment, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Smile className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">DentalPro</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#servicios" className="hover:text-foreground transition-smooth">Servicios</a>
            <a href="#doctor" className="hover:text-foreground transition-smooth">Nuestro Equipo</a>
            <a href="#contacto" className="hover:text-foreground transition-smooth">Contacto</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogin}
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-teal-light transition-smooth"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={onBookAppointment}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-teal-dark transition-smooth shadow-sm"
            >
              Agendar Cita
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-light text-primary rounded-full text-sm font-medium">
                <Shield className="w-3.5 h-3.5" />
                Clínica certificada y de confianza
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight text-balance">
                Tu sonrisa merece el{' '}
                <span className="text-primary">mejor cuidado</span> dental
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Tecnología de vanguardia, atención personalizada y un equipo de especialistas
                comprometidos con tu bienestar. Agenda tu cita en minutos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onBookAppointment}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-teal-dark transition-smooth shadow-md"
                >
                  Agendar Cita en Línea
                  <ChevronRight className="w-4 h-4" />
                </button>
                <a
                  href="https://wa.me/521234567890"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-medium text-foreground bg-card border border-border rounded-xl hover:bg-slate-surface transition-smooth"
                >
                  <MessageCircle className="w-4 h-4 text-accent" />
                  WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-teal-light border-2 border-card flex items-center justify-center text-xs font-bold text-primary">
                      {['A','M','R','L'][i-1]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">+3,400 pacientes satisfechos</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src="/hero-dental.jpg"
                  alt="Clínica dental moderna con equipamiento de vanguardia"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-lg p-3 flex items-center gap-3 border border-border">
                <div className="w-10 h-10 bg-success-muted rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Certificación</p>
                  <p className="text-sm font-semibold text-foreground">ISO 9001:2015</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-primary-foreground">{s.value}</div>
                <div className="text-sm text-primary-foreground/70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicios" className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">Servicios</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
              Atención dental integral
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Desde revisiones preventivas hasta tratamientos especializados, contamos con todo lo que necesitas.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s) => (
              <div
                key={s.title}
                className="group bg-card border border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-smooth cursor-pointer"
                onClick={onBookAppointment}
              >
                <div className="w-12 h-12 bg-teal-light rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-smooth">
                  <s.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-smooth" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-smooth">
                  Agendar <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor Profile */}
      <section id="doctor" className="py-16 bg-slate-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">Nuestro Equipo</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
              Dentistas expertos y comprometidos
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start shadow-sm">
              <div className="relative shrink-0">
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-teal-light">
                  <Image
                    src="/doctor-profile.jpg"
                    alt="Dra. Sofía Ramírez, Directora Médica"
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-accent rounded-full p-1.5 border-2 border-card">
                  <Shield className="w-3 h-3 text-accent-foreground" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-light text-primary rounded-full text-xs font-medium mb-2">
                  <Award className="w-3 h-3" />
                  Directora Médica
                </div>
                <h3 className="text-xl font-bold text-foreground">Dra. Sofía Ramírez</h3>
                <p className="text-muted-foreground text-sm mt-1 mb-3">Cirujana Dentista • Esp. en Ortodoncia</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Con más de 12 años de experiencia, la Dra. Ramírez se especializa en ortodoncia y estética dental.
                  Egresada de la UNAM con posgrado en la Universidad de Barcelona.
                </p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {['Ortodoncia', 'Estética Dental', 'Implantología'].map((spec) => (
                    <span key={spec} className="px-3 py-1 bg-teal-light text-primary text-xs font-medium rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-1 justify-center sm:justify-start">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1.5">4.9 / 5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground text-balance mb-4">
            ¿Listo para tu mejor sonrisa?
          </h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8 leading-relaxed">
            Agenda tu cita en línea en menos de 2 minutos. Sin filas, sin espera.
          </p>
          <button
            onClick={onBookAppointment}
            className="inline-flex items-center gap-2 px-8 py-4 bg-card text-primary font-bold rounded-xl hover:bg-teal-light transition-smooth shadow-lg text-lg"
          >
            Agendar Cita en Línea
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-foreground text-primary-foreground/80 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Smile className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-primary-foreground">DentalPro</span>
              </div>
              <p className="text-sm leading-relaxed">
                Tu clínica dental de confianza. Cuidamos tu sonrisa con tecnología y calidez humana.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-primary-foreground mb-3">Horarios</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>Lunes – Viernes: 9:00 – 19:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>Sábados: 9:00 – 14:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>Domingos: Cerrado</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-primary-foreground mb-3">Contacto</h4>
              <div className="space-y-2 text-sm">
                <a href="tel:+521234567890" className="flex items-center gap-2 hover:text-primary-foreground transition-smooth">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  +52 (123) 456-7890
                </a>
                <a href="https://wa.me/521234567890" className="flex items-center gap-2 hover:text-primary-foreground transition-smooth">
                  <MessageCircle className="w-4 h-4 text-primary shrink-0" />
                  WhatsApp directo
                </a>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Av. Insurgentes Sur 1234,<br />Col. Del Valle, CDMX</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="rounded-xl overflow-hidden border border-white/10 h-40 bg-foreground/30 flex items-center justify-center mb-8">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-primary-foreground/60">Google Maps — Av. Insurgentes Sur 1234, CDMX</p>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-primary text-sm underline mt-1 inline-block">
                Cómo llegar →
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-primary-foreground/50">
            <p>© 2025 DentalPro. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-foreground/80 transition-smooth">Aviso de Privacidad</a>
              <a href="#" className="hover:text-primary-foreground/80 transition-smooth">Términos de Uso</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
