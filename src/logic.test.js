import test from 'node:test'
import assert from 'node:assert/strict'
import { calcularStats, filtrar, moverEtapa, necesitaSeguimiento } from './logic.js'

const hoy = new Date('2026-11-13T12:00:00')
const job = (o) => ({ id: 'x', empresa: 'Acme', puesto: 'Dev', modalidad: 'Remoto', notas: '', etapa: 'Postulada', ultimoMovimiento: '2026-11-01', ...o })

test('necesitaSeguimiento: solo Postulada con 7+ días', () => {
  assert.equal(necesitaSeguimiento(job({}), hoy), true)
  assert.equal(necesitaSeguimiento(job({ ultimoMovimiento: '2026-11-10' }), hoy), false)
  assert.equal(necesitaSeguimiento(job({ etapa: 'Entrevista' }), hoy), false)
})

test('moverEtapa actualiza fecha y valida etapa', () => {
  const j = moverEtapa(job({}), 'Entrevista', hoy)
  assert.equal(j.etapa, 'Entrevista')
  assert.equal(j.ultimoMovimiento, '2026-11-13')
  assert.throws(() => moverEtapa(job({}), 'Inventada', hoy))
})

test('calcularStats: tasas sin dividir por cero', () => {
  assert.equal(calcularStats([]).tasaRespuesta, 0)
  const s = calcularStats([job({}), job({ etapa: 'Entrevista' }), job({ etapa: 'Rechazada' }), job({ etapa: 'Guardada' })])
  assert.equal(s.postuladas, 3)
  assert.equal(s.tasaRespuesta, 67)
  assert.equal(s.tasaEntrevista, 33)
})

test('filtrar por texto y modalidad', () => {
  const jobs = [job({ empresa: 'Zeta' }), job({ empresa: 'Beta', modalidad: 'Híbrido' })]
  assert.equal(filtrar(jobs, { q: 'zeta' }).length, 1)
  assert.equal(filtrar(jobs, { modalidad: 'Híbrido' }).length, 1)
})
