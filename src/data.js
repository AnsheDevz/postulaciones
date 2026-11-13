// Datos de ejemplo ficticios. Las fechas son relativas a hoy para que el demo siempre se vea vivo.
const dia = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export const SEED = [
  { id: 'j1', empresa: 'Nubecita Software', puesto: 'Frontend Developer Jr.', modalidad: 'Remoto', salario: 1200000, moneda: 'ARS', link: '', etapa: 'Entrevista', ultimoMovimiento: dia(2), notas: 'Entrevista técnica el jueves. Repasar hooks.' },
  { id: 'j2', empresa: 'Banco Ficticio', puesto: 'Analista de Soporte IT', modalidad: 'Híbrido', salario: 950000, moneda: 'ARS', link: '', etapa: 'Postulada', ultimoMovimiento: dia(10), notas: 'Enviar mail de seguimiento a RR. HH.' },
  { id: 'j3', empresa: 'Logística Sur', puesto: 'Data Entry', modalidad: 'Presencial', salario: 780000, moneda: 'ARS', link: '', etapa: 'Postulada', ultimoMovimiento: dia(3), notas: '' },
  { id: 'j4', empresa: 'Studio Pixel', puesto: 'Junior React Developer', modalidad: 'Remoto', salario: 900, moneda: 'USD', link: '', etapa: 'Guardada', ultimoMovimiento: dia(1), notas: 'Armar portfolio con 3 proyectos antes de postular.' },
  { id: 'j5', empresa: 'Retail Express', puesto: 'Atención al cliente', modalidad: 'Híbrido', salario: 720000, moneda: 'ARS', link: '', etapa: 'Rechazada', ultimoMovimiento: dia(6), notas: 'Pidieron experiencia en ventas.' },
  { id: 'j6', empresa: 'Estudio Jurídico Norte', puesto: 'Asistente administrativo', modalidad: 'Remoto', salario: 1100000, moneda: 'ARS', link: '', etapa: 'Oferta', ultimoMovimiento: dia(1), notas: 'Responder la oferta antes del viernes.' },
  { id: 'j7', empresa: 'Fintech Andina', puesto: 'Help Desk N1', modalidad: 'Remoto', salario: 800, moneda: 'USD', link: '', etapa: 'Postulada', ultimoMovimiento: dia(8), notas: '' },
]
