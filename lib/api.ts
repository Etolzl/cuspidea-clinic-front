const API_URL = 'http://localhost:3000/api/v1';

export interface RegisterParams {
  email: string;
  password?: string;
  nombre_completo: string;
  telefono?: string;
  rol?: string;
}

export async function login(email: string, password?: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al iniciar sesión');
  }
  return res.json();
}

export async function register(params: RegisterParams) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al registrarse');
  }
  return res.json();
}

export async function getDentistas() {
  const res = await fetch(`${API_URL}/perfiles/dentistas`);
  if (!res.ok) {
    throw new Error('Error al obtener la lista de dentistas');
  }
  return res.json();
}

export interface CitaCreateParams {
  paciente_id: number;
  dentista_id: string;
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  motivo_consulta: string;
}

export async function createCita(token: string, params: CitaCreateParams) {
  const res = await fetch(`${API_URL}/citas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al crear la cita');
  }
  return res.json();
}

export async function getPacienteByEmail(token: string, email: string) {
  const res = await fetch(`${API_URL}/pacientes?search=${email}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Error al buscar datos de paciente');
  }
  return res.json();
}

export async function createPaciente(token: string, params: { nombre_completo: string; correo: string; telefono?: string; perfil_id?: string }) {
  const res = await fetch(`${API_URL}/pacientes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al crear el perfil de paciente');
  }
  return res.json();
}

export async function getCitasByDate(date: string) {
  // Ajustar el inicio y fin del día en horario local / UTC para traer las citas correspondientes
  const startOfDay = `${date}T00:00:00.000Z`;
  const endOfDay = `${date}T23:59:59.999Z`;
  const res = await fetch(`${API_URL}/citas?fecha_desde=${startOfDay}&fecha_hasta=${endOfDay}`);
  if (!res.ok) {
    throw new Error('Error al obtener las citas de este día');
  }
  return res.json();
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al solicitar recuperación de contraseña');
  }
  return res.json();
}

export async function exchangeCode(code: string) {
  const res = await fetch(`${API_URL}/auth/exchange-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al procesar el código de recuperación');
  }
  return res.json();
}

export async function updatePassword(token: string, password: string) {
  const res = await fetch(`${API_URL}/auth/update-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al actualizar la contraseña');
  }
  return res.json();
}

export async function sendInvitation(email: string, name: string) {
  const res = await fetch(`${API_URL}/auth/send-invitation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al enviar la invitación');
  }
  return res.json();
}



