// Lógica pura (sin React): se puede probar con `node --test`.
export const ETAPAS = ['Guardada', 'Postulada', 'Entrevista', 'Oferta', 'Rechazada']
export const MODALIDADES = ['Remoto', 'Híbrido', 'Presencial']
export const DIAS_SEGUIMIENTO = 7

const DAY = 86_400_000

export function diasDesde(fechaISO, hoy = new Date()) {
  const d = new Date(fechaISO + 'T00:00:00')
  return Math.floor((hoy - d) / DAY)
}

/** Una postulación necesita seguimiento si lleva N días sin novedades en etapa "Postulada". */
export function necesitaSeguimiento(job, hoy = new Date()) {
  return job.etapa === 'Postulada' && diasDesde(job.ultimoMovimiento, hoy) >= DIAS_SEGUIMIENTO
}

/** Mueve una postulación de etapa y registra la fecha del movimiento. */
export function moverEtapa(job, etapa, hoy = new Date()) {
  if (!ETAPAS.includes(etapa)) throw new Error(`Etapa inválida: ${etapa}`)
  if (job.etapa === etapa) return job
  return { ...job, etapa, ultimoMovimiento: hoy.toISOString().slice(0, 10) }
}

/** Métricas del embudo. Respuesta = pasó a Entrevista, Oferta o Rechazada tras postular. */
export function calcularStats(jobs) {
  const postuladas = jobs.filter((j) => j.etapa !== 'Guardada')
  const conRespuesta = jobs.filter((j) => ['Entrevista', 'Oferta', 'Rechazada'].includes(j.etapa))
  const entrevistas = jobs.filter((j) => ['Entrevista', 'Oferta'].includes(j.etapa))
  const pct = (a, b) => (b === 0 ? 0 : Math.round((a / b) * 100))
  return {
    total: jobs.length,
    postuladas: postuladas.length,
    entrevistas: entrevistas.length,
    ofertas: jobs.filter((j) => j.etapa === 'Oferta').length,
    tasaRespuesta: pct(conRespuesta.length, postuladas.length),
    tasaEntrevista: pct(entrevistas.length, postuladas.length),
    porEtapa: Object.fromEntries(ETAPAS.map((e) => [e, jobs.filter((j) => j.etapa === e).length])),
  }
}

export function filtrar(jobs, { q = '', modalidad = 'Todas' } = {}) {
  const term = q.trim().toLowerCase()
  return jobs.filter(
    (j) =>
      (modalidad === 'Todas' || j.modalidad === modalidad) &&
      (!term || `${j.empresa} ${j.puesto} ${j.notas}`.toLowerCase().includes(term)),
  )
}
