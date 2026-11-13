import { useEffect, useMemo, useState } from 'react'
import { useJobs, newId } from './store.js'
import { ETAPAS, MODALIDADES, calcularStats, filtrar, necesitaSeguimiento, diasDesde } from './logic.js'

const money = (n, m) =>
  n > 0 ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: m, maximumFractionDigits: 0 }).format(n) : 'A convenir'

const blank = () => ({
  id: newId(), empresa: '', puesto: '', modalidad: 'Remoto', salario: '', moneda: 'ARS', link: '',
  etapa: 'Guardada', ultimoMovimiento: new Date().toISOString().slice(0, 10), notas: '',
})

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <header><h2>{title}</h2><button className="x" onClick={onClose} aria-label="Cerrar">×</button></header>
        {children}
      </div>
    </div>
  )
}

function JobForm({ initial, onSave, onDelete, onClose }) {
  const [f, setF] = useState(initial ?? blank())
  const [err, setErr] = useState({})
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))
  function submit(e) {
    e.preventDefault()
    const er = {}
    if (!f.empresa.trim()) er.empresa = 'Falta la empresa.'
    if (!f.puesto.trim()) er.puesto = 'Falta el puesto.'
    setErr(er)
    if (!Object.keys(er).length) onSave({ ...f, salario: Number(f.salario) || 0 })
  }
  return (
    <Modal title={initial ? 'Editar postulación' : 'Nueva postulación'} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <label>Empresa<input value={f.empresa} onChange={set('empresa')} autoFocus />{err.empresa && <small>{err.empresa}</small>}</label>
        <label>Puesto<input value={f.puesto} onChange={set('puesto')} />{err.puesto && <small>{err.puesto}</small>}</label>
        <div className="row">
          <label>Modalidad<select value={f.modalidad} onChange={set('modalidad')}>{MODALIDADES.map((m) => <option key={m}>{m}</option>)}</select></label>
          <label>Etapa<select value={f.etapa} onChange={set('etapa')}>{ETAPAS.map((m) => <option key={m}>{m}</option>)}</select></label>
        </div>
        <div className="row">
          <label>Salario<input type="number" min="0" value={f.salario} onChange={set('salario')} /></label>
          <label>Moneda<select value={f.moneda} onChange={set('moneda')}><option>ARS</option><option>USD</option></select></label>
        </div>
        <label>Link de la oferta<input type="url" value={f.link} onChange={set('link')} placeholder="https://" /></label>
        <label>Notas<textarea rows="3" value={f.notas} onChange={set('notas')} /></label>
        <div className="actions">
          {initial && <button type="button" className="btn danger" onClick={() => onDelete(initial)}>Eliminar</button>}
          <span style={{ flex: 1 }} />
          <button type="button" className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn primary">Guardar</button>
        </div>
      </form>
    </Modal>
  )
}

function Card({ job, dispatch, onEdit }) {
  const seguimiento = necesitaSeguimiento(job)
  return (
    <article
      className={`job ${seguimiento ? 'job--alert' : ''}`}
      draggable
      onDragStart={(e) => { e.dataTransfer.setData('text/plain', job.id); e.dataTransfer.effectAllowed = 'move' }}
    >
      <header>
        <div><h3>{job.puesto}</h3><p className="muted">{job.empresa}</p></div>
        <button className="x" onClick={() => onEdit(job)} aria-label={`Editar ${job.puesto}`}>✎</button>
      </header>
      <p className="tags"><span className="tag">{job.modalidad}</span><span className="tag">{money(job.salario, job.moneda)}</span></p>
      {seguimiento && <p className="alert">⏰ Sin novedades hace {diasDesde(job.ultimoMovimiento)} días: hacé seguimiento</p>}
      {job.notas && <p className="notes">{job.notas}</p>}
      <label className="move">
        <span className="sr">Mover {job.puesto} a otra etapa</span>
        <select value={job.etapa} onChange={(e) => dispatch({ type: 'move', id: job.id, etapa: e.target.value })}>
          {ETAPAS.map((e) => <option key={e}>{e}</option>)}
        </select>
      </label>
    </article>
  )
}

export default function App() {
  const [jobs, dispatch] = useJobs()
  const [modal, setModal] = useState(null)
  const [q, setQ] = useState('')
  const [modalidad, setModalidad] = useState('Todas')
  const [over, setOver] = useState(null)

  const visibles = useMemo(() => filtrar(jobs, { q, modalidad }), [jobs, q, modalidad])
  const stats = useMemo(() => calcularStats(jobs), [jobs])
  const pendientes = jobs.filter((j) => necesitaSeguimiento(j)).length

  const save = (job) => { dispatch({ type: 'save', payload: job }); setModal(null) }
  const del = (job) => {
    if (window.confirm(`¿Eliminar "${job.puesto}" en ${job.empresa}?`)) { dispatch({ type: 'delete', id: job.id }); setModal(null) }
  }
  const drop = (etapa) => (e) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (id) dispatch({ type: 'move', id, etapa })
    setOver(null)
  }

  return (
    <div className="shell">
      <header className="top">
        <div><h1>Postulaciones</h1><p className="muted">Tu búsqueda laboral, en un tablero.</p></div>
        <div className="top__actions">
          <button className="btn ghost" onClick={() => window.confirm('Se restauran los datos de ejemplo. ¿Continuar?') && dispatch({ type: 'reset' })}>Restaurar demo</button>
          <button className="btn primary" onClick={() => setModal({})}>+ Nueva postulación</button>
        </div>
      </header>

      <section className="stats" aria-label="Métricas">
        <div className="stat"><span>Postuladas</span><strong>{stats.postuladas}</strong></div>
        <div className="stat"><span>Tasa de respuesta</span><strong>{stats.tasaRespuesta}%</strong></div>
        <div className="stat"><span>Entrevistas</span><strong>{stats.entrevistas}</strong></div>
        <div className={`stat ${pendientes ? 'stat--alert' : ''}`}><span>Para seguimiento</span><strong>{pendientes}</strong></div>
      </section>

      <div className="toolbar">
        <input type="search" placeholder="Buscar empresa, puesto o nota…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar" />
        <select value={modalidad} onChange={(e) => setModalidad(e.target.value)} aria-label="Modalidad">
          <option>Todas</option>{MODALIDADES.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>

      <div className="board">
        {ETAPAS.map((etapa) => {
          const col = visibles.filter((j) => j.etapa === etapa)
          return (
            <section
              key={etapa}
              className={`col ${over === etapa ? 'col--over' : ''}`}
              aria-label={`Etapa ${etapa}`}
              onDragOver={(e) => { e.preventDefault(); setOver(etapa) }}
              onDragLeave={() => setOver((o) => (o === etapa ? null : o))}
              onDrop={drop(etapa)}
            >
              <h2>{etapa}<span>{col.length}</span></h2>
              <div className="col__list">
                {col.length === 0 && <p className="muted empty">Arrastrá una tarjeta acá</p>}
                {col.map((j) => <Card key={j.id} job={j} dispatch={dispatch} onEdit={(x) => setModal({ job: x })} />)}
              </div>
            </section>
          )
        })}
      </div>

      {modal && <JobForm initial={modal.job} onSave={save} onDelete={del} onClose={() => setModal(null)} />}
    </div>
  )
}
