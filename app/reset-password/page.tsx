'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Smile, Lock, ArrowRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import * as api from '@/lib/api'

function ResetPasswordFormContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationError, setVerificationError] = useState<string | null>(null)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const hasProcessedAuth = useRef(false)

  // 1. Detectar token o código al cargar la página
  useEffect(() => {
    if (hasProcessedAuth.current) return
    hasProcessedAuth.current = true

    const handleAuth = async () => {
      // Verificar primero si hay errores en el hash (#error=...)
      if (typeof window !== 'undefined' && window.location.hash) {
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)
        const hashError = params.get('error')
        const errorCode = params.get('error_code')
        const errorDescription = params.get('error_description')

        if (hashError) {
          const friendlyMessages: Record<string, string> = {
            'otp_expired': 'El enlace de recuperación ha expirado. Por favor, solicita uno nuevo.',
            'access_denied': 'El acceso fue denegado. El enlace puede haber sido usado anteriormente o ha expirado.',
          }
          const message = friendlyMessages[errorCode || ''] 
            || errorDescription?.replace(/\+/g, ' ') 
            || 'El enlace de recuperación es inválido.'
          
          setVerificationError(message)
          setIsVerifying(false)
          window.history.replaceState(null, '', window.location.pathname)
          return
        }

        // Flujo implícito hash (#access_token=...)
        const accessToken = params.get('access_token')
        const type = params.get('type')

        if (accessToken && type === 'recovery') {
          setToken(accessToken)
          setIsVerifying(false)
          window.history.replaceState(null, '', window.location.pathname)
          return
        }
      }

      // Verificar si hay código PKCE en la URL (?code=...)
      const code = searchParams.get('code')
      if (code) {
        try {
          const res = await api.exchangeCode(code)
          setToken(res.session.access_token)
          setIsVerifying(false)
        } catch (err: any) {
          console.error(err)
          setVerificationError(err.message || 'El enlace de recuperación ha expirado o es inválido.')
          setIsVerifying(false)
        }
        return
      }

      // Si no se encuentra ni código ni hash
      setVerificationError('No se encontró un código o token de autenticación válido en el enlace.')
      setIsVerifying(false)
    }

    handleAuth()
  }, [searchParams])

  // 2. Manejar envío del formulario para actualizar contraseña
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (password.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.')
      return
    }

    if (!token) {
      setFormError('La sesión de recuperación ha caducado. Vuelve a solicitar el correo.')
      return
    }

    setIsLoading(true)

    try {
      await api.updatePassword(token, password)
      setSuccess(true)
    } catch (err: any) {
      console.error(err)
      setFormError(err.message || 'Error al actualizar tu contraseña')
    } finally {
      setIsLoading(false)
    }
  }

  // Vista de verificación inicial
  if (isVerifying) {
    return (
      <div className="p-8 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
        <h2 className="text-lg font-semibold text-foreground">Verificando enlace...</h2>
        <p className="text-sm text-muted-foreground">Por favor, espera un momento mientras validamos tu sesión de seguridad.</p>
      </div>
    )
  }

  // Vista de error de validación del enlace
  if (verificationError) {
    return (
      <div className="p-8 space-y-6 text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto text-destructive">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Enlace Inválido</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {verificationError}
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="w-full bg-primary hover:bg-teal-dark text-primary-foreground font-semibold py-3 rounded-xl transition-smooth flex items-center justify-center gap-2 mt-4 shadow-md"
        >
          Volver a solicitar enlace
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  // Vista de éxito al guardar
  if (success) {
    return (
      <div className="p-8 space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-success-muted rounded-full flex items-center justify-center mx-auto text-success">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">¡Contraseña Actualizada!</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tu nueva contraseña ha sido guardada con éxito. Ya puedes iniciar sesión con tus nuevas credenciales.
          </p>
        </div>
        <Link
          href="/?view=login"
          className="w-full bg-primary hover:bg-teal-dark text-primary-foreground font-semibold py-3 rounded-xl transition-smooth flex items-center justify-center gap-2 mt-4 shadow-md"
        >
          Ir a Iniciar Sesión
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  // Vista del formulario de cambio de contraseña
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Nueva Contraseña</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Crea una nueva contraseña segura para tu cuenta.
        </p>
      </div>

      {formError && (
        <div className="mb-5 p-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-medium">{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Nueva contraseña</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Confirmar nueva contraseña</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Confirma la contraseña"
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
              Restablecer contraseña
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="bg-card border-b border-border shadow-sm p-4 flex items-center justify-between">
        <Link 
          href="/?view=login" 
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver al Home
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
          <Suspense fallback={
            <div className="p-8 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
              <h2 className="text-lg font-semibold text-foreground">Cargando...</h2>
            </div>
          }>
            <ResetPasswordFormContent />
          </Suspense>
          <div className="bg-slate-surface border-t border-border p-4 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Problemas con el enlace?{' '}
              <Link href="/forgot-password" className="text-primary font-medium hover:underline">
                Solicita otro enlace
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
