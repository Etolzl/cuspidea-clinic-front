'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Smile, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import * as api from '@/lib/api'


interface LoginFormProps {
  onLoginSuccess: (data: any) => void
  onBack: () => void
}

export default function LoginForm({ onLoginSuccess, onBack }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await api.login(email, password)
      onLoginSuccess(data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Correo o contraseña incorrectos')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="bg-card border-b border-border shadow-sm p-4 flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Smile className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground tracking-tight">DentalPro</span>
        </div>
        <div className="w-16" /> {/* Spacer */}
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground">Bienvenido de nuevo</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Ingresa tus credenciales para acceder a tu portal de paciente
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Correo electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="ejemplo@correo.com"
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Contraseña</label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-teal-dark text-primary-foreground font-semibold py-3 rounded-xl transition-smooth flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
          <div className="bg-slate-surface border-t border-border p-4 text-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <button onClick={onBack} className="text-primary font-medium hover:underline">
                Regístrate agendando una cita
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
