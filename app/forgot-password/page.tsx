'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Smile, Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import * as api from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await api.forgotPassword(email)
      setSuccess(true)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Ocurrió un error al procesar tu solicitud')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="bg-card border-b border-border shadow-sm p-4 flex items-center justify-between">
        <Link 
          href="/?view=login" 
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver al Login
        </Link>
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
              <h1 className="text-2xl font-bold text-foreground">¿Olvidaste tu contraseña?</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Ingresa tu correo registrado y te enviaremos un enlace de recuperación.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {success ? (
              <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-success-muted rounded-full flex items-center justify-center mx-auto text-success">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">¡Correo enviado!</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Hemos enviado instrucciones para cambiar tu contraseña a <strong className="text-foreground">{email}</strong>. Por favor, revisa tu bandeja de entrada o spam.
                  </p>
                </div>
                <Link
                  href="/?view=login"
                  className="w-full bg-primary hover:bg-teal-dark text-primary-foreground font-semibold py-3 rounded-xl transition-smooth flex items-center justify-center gap-2 mt-4 shadow-md"
                >
                  Volver al Iniciar Sesión
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-teal-dark text-primary-foreground font-semibold py-3 rounded-xl transition-smooth flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      Enviar enlace de recuperación
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
          <div className="bg-slate-surface border-t border-border p-4 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Recordaste tu contraseña?{' '}
              <Link href="/?view=login" className="text-primary font-medium hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
