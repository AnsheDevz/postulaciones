import { useEffect, useReducer } from 'react'
import { SEED } from './data.js'
import { moverEtapa } from './logic.js'

const KEY = 'postulaciones:v1'
export const newId = () => globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(16).slice(2)}`

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* JSON roto: usamos el demo */
  }
  return SEED
}

function reducer(jobs, action) {
  switch (action.type) {
    case 'save': {
      const j = action.payload
      return jobs.some((x) => x.id === j.id) ? jobs.map((x) => (x.id === j.id ? j : x)) : [j, ...jobs]
    }
    case 'delete':
      return jobs.filter((j) => j.id !== action.id)
    case 'move':
      return jobs.map((j) => (j.id === action.id ? moverEtapa(j, action.etapa) : j))
    case 'reset':
      return SEED
    default:
      return jobs
  }
}

export function useJobs() {
  const [jobs, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(jobs))
    } catch {
      /* sin almacenamiento: seguimos en memoria */
    }
  }, [jobs])
  return [jobs, dispatch]
}
