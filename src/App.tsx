import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Download,
  Edit3,
  Filter,
  LayoutDashboard,
  Menu,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import { createDemoLeads, createDemoTasks, revenueData } from './data'
import type { Lead, LeadStatus, Task, TaskPriority, View } from './types'

const LEADS_KEY = 'opspilot-mini-leads'
const TASKS_KEY = 'opspilot-mini-tasks'
const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost']
const priorities: TaskPriority[] = ['Low', 'Medium', 'High']

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const shortCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(`${value}T12:00:00`),
  )

const todayIso = () => new Date().toISOString().slice(0, 10)
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`

const readStorage = <T,>(key: string, fallback: () => T): T => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? (JSON.parse(saved) as T) : fallback()
  } catch {
    return fallback()
  }
}

const statusStyles: Record<LeadStatus, string> = {
  New: 'bg-sky-50 text-sky-700 ring-sky-600/15',
  Contacted: 'bg-amber-50 text-amber-700 ring-amber-600/15',
  Qualified: 'bg-violet-50 text-violet-700 ring-violet-600/15',
  Proposal: 'bg-indigo-50 text-indigo-700 ring-indigo-600/15',
  Won: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  Lost: 'bg-slate-100 text-slate-600 ring-slate-500/15',
}

const priorityStyles: Record<TaskPriority, string> = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-amber-50 text-amber-700',
  High: 'bg-rose-50 text-rose-700',
}

function StatusBadge({ status }: { status: LeadStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status]}`}>{status}</span>
}

function Modal({ title, description, onClose, children }: { title: string; description: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="max-h-[94vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-xl sm:rounded-3xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

const emptyLead: Omit<Lead, 'id'> = {
  name: '', company: '', email: '', status: 'New', value: 0, lastContact: todayIso(), source: 'Website',
}

function LeadForm({ initial, onSave, onClose }: { initial?: Lead; onSave: (lead: Omit<Lead, 'id'>) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<Lead, 'id'>>(initial ? { ...initial } : emptyLead)
  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSave({ ...form, value: Number(form.value) })
  }
  return (
    <form onSubmit={submit} className="space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label><span className="label">Contact name</span><input className="input" required autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Alex Morgan" /></label>
        <label><span className="label">Company</span><input className="input" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. Acme Studio" /></label>
      </div>
      <label><span className="label">Email</span><input className="input" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="alex@example.com" /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label><span className="label">Status</span><select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        <label><span className="label">Estimated value</span><input className="input" required type="number" min="0" step="100" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} /></label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label><span className="label">Last contact</span><input className="input" required type="date" value={form.lastContact} onChange={(e) => setForm({ ...form, lastContact: e.target.value })} /></label>
        <label><span className="label">Lead source</span><select className="input" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>{['Website', 'Referral', 'Outbound', 'Event', 'Partner', 'Other'].map((source) => <option key={source}>{source}</option>)}</select></label>
      </div>
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" className="btn-secondary" onClick={onClose}>Cancel</button><button type="submit" className="btn-primary">{initial ? 'Save changes' : 'Add lead'}</button></div>
    </form>
  )
}

const emptyTask: Omit<Task, 'id'> = { title: '', relatedTo: '', priority: 'Medium', dueDate: todayIso(), completed: false }

function TaskForm({ initial, leads, onSave, onClose }: { initial?: Task; leads: Lead[]; onSave: (task: Omit<Task, 'id'>) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<Task, 'id'>>(initial ? { ...initial } : emptyTask)
  const submit = (event: FormEvent) => { event.preventDefault(); onSave(form) }
  return (
    <form onSubmit={submit} className="space-y-4 p-6">
      <label><span className="label">Task title</span><input className="input" required autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?" /></label>
      <label><span className="label">Related company</span><input className="input" list="companies" value={form.relatedTo} onChange={(e) => setForm({ ...form, relatedTo: e.target.value })} placeholder="Optional" /><datalist id="companies">{leads.map((lead) => <option key={lead.id} value={lead.company} />)}</datalist></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label><span className="label">Priority</span><select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
        <label><span className="label">Due date</span><input className="input" required type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></label>
      </div>
      <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"><input className="h-4 w-4 accent-indigo-600" type="checkbox" checked={form.completed} onChange={(e) => setForm({ ...form, completed: e.target.checked })} />Mark as complete</label>
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" className="btn-secondary" onClick={onClose}>Cancel</button><button type="submit" className="btn-primary">{initial ? 'Save changes' : 'Add task'}</button></div>
    </form>
  )
}

function App() {
  const [leads, setLeads] = useState<Lead[]>(() => readStorage(LEADS_KEY, createDemoLeads))
  const [tasks, setTasks] = useState<Task[]>(() => readStorage(TASKS_KEY, createDemoTasks))
  const [view, setView] = useState<View>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [leadModal, setLeadModal] = useState<Lead | 'new' | null>(null)
  const [taskModal, setTaskModal] = useState<Task | 'new' | null>(null)
  const [notice, setNotice] = useState('')

  useEffect(() => localStorage.setItem(LEADS_KEY, JSON.stringify(leads)), [leads])
  useEffect(() => localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)), [tasks])
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 2600)
    return () => window.clearTimeout(timer)
  }, [notice])

  const totalPipeline = leads.filter((lead) => !['Won', 'Lost'].includes(lead.status)).reduce((sum, lead) => sum + lead.value, 0)
  const won = leads.filter((lead) => lead.status === 'Won').length
  const conversion = leads.length ? Math.round((won / leads.length) * 100) : 0
  const overdue = tasks.filter((task) => !task.completed && task.dueDate < todayIso()).length
  const pipelineData = statuses.map((status) => ({ status, leads: leads.filter((lead) => lead.status === status).length }))

  const notify = (message: string) => setNotice(message)
  const navigate = (next: View) => { setView(next); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const saveLead = (data: Omit<Lead, 'id'>) => {
    if (leadModal && leadModal !== 'new') {
      setLeads((current) => current.map((lead) => lead.id === leadModal.id ? { ...data, id: lead.id } : lead))
      notify('Lead updated')
    } else {
      setLeads((current) => [{ ...data, id: uid('lead') }, ...current])
      notify('Lead added')
    }
    setLeadModal(null)
  }

  const deleteLead = (lead: Lead) => {
    if (window.confirm(`Delete ${lead.name} from your leads?`)) {
      setLeads((current) => current.filter((item) => item.id !== lead.id))
      notify('Lead deleted')
    }
  }

  const saveTask = (data: Omit<Task, 'id'>) => {
    if (taskModal && taskModal !== 'new') {
      setTasks((current) => current.map((task) => task.id === taskModal.id ? { ...data, id: task.id } : task))
      notify('Task updated')
    } else {
      setTasks((current) => [{ ...data, id: uid('task') }, ...current])
      notify('Task added')
    }
    setTaskModal(null)
  }

  const deleteTask = (task: Task) => {
    if (window.confirm(`Delete “${task.title}”?`)) {
      setTasks((current) => current.filter((item) => item.id !== task.id))
      notify('Task deleted')
    }
  }

  const resetData = () => {
    if (window.confirm('Reset all leads and tasks to the original fictional demo data?')) {
      setLeads(createDemoLeads())
      setTasks(createDemoTasks())
      notify('Demo data restored')
    }
  }

  const exportCsv = () => {
    const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`
    const rows = [
      ['Name', 'Company', 'Email', 'Status', 'Value', 'Last Contact', 'Source'],
      ...leads.map((lead) => [lead.name, lead.company, lead.email, lead.status, lead.value, lead.lastContact, lead.source]),
    ]
    const csv = rows.map((row) => row.map(escape).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `opspilot-leads-${todayIso()}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
    notify('CSV exported')
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      {sidebarOpen && <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <Sidebar view={view} open={sidebarOpen} onNavigate={navigate} onClose={() => setSidebarOpen(false)} onReset={resetData} />

      <div className="lg:pl-64">
        <Topbar view={view} onMenu={() => setSidebarOpen(true)} onAddLead={() => setLeadModal('new')} />
        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {view === 'dashboard' && <Dashboard leads={leads} tasks={tasks} totalPipeline={totalPipeline} conversion={conversion} overdue={overdue} pipelineData={pipelineData} onViewLeads={() => navigate('leads')} onViewTasks={() => navigate('tasks')} />}
          {view === 'leads' && <Leads leads={leads} onAdd={() => setLeadModal('new')} onEdit={setLeadModal} onDelete={deleteLead} onExport={exportCsv} />}
          {view === 'tasks' && <Tasks tasks={tasks} onAdd={() => setTaskModal('new')} onEdit={setTaskModal} onDelete={deleteTask} onToggle={(id) => setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task))} />}
        </main>
      </div>

      {leadModal && <Modal title={leadModal === 'new' ? 'Add a new lead' : 'Edit lead'} description="Keep your pipeline current and actionable." onClose={() => setLeadModal(null)}><LeadForm initial={leadModal === 'new' ? undefined : leadModal} onSave={saveLead} onClose={() => setLeadModal(null)} /></Modal>}
      {taskModal && <Modal title={taskModal === 'new' ? 'Add a new task' : 'Edit task'} description="Set a clear next step and due date." onClose={() => setTaskModal(null)}><TaskForm initial={taskModal === 'new' ? undefined : taskModal} leads={leads} onSave={saveTask} onClose={() => setTaskModal(null)} /></Modal>}
      {notice && <div className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl"><CheckCircle2 size={17} className="text-emerald-400" />{notice}</div>}
    </div>
  )
}

function Sidebar({ view, open, onNavigate, onClose, onReset }: { view: View; open: boolean; onNavigate: (view: View) => void; onClose: () => void; onReset: () => void }) {
  const items: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Lead CRM', icon: Users },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
  ]
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#0b1220] text-white transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-[73px] items-center justify-between border-b border-white/10 px-6">
        <button className="flex items-center gap-3" onClick={() => onNavigate('dashboard')}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-900/30"><BriefcaseBusiness size={19} /></span>
          <span className="text-left"><span className="block text-base font-bold tracking-tight">OpsPilot</span><span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Mini workspace</span></span>
        </button>
        <button className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden" onClick={onClose} aria-label="Close menu"><X size={19} /></button>
      </div>
      <nav className="flex-1 px-3 py-6" aria-label="Main navigation">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Workspace</p>
        <div className="space-y-1">{items.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => onNavigate(id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${view === id ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-950/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Icon size={18} />{label}</button>)}</div>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400"><Sparkles size={18} /></div>
          <p className="text-sm font-semibold">Local & private</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">Your workspace data stays in this browser.</p>
        </div>
      </nav>
      <div className="border-t border-white/10 p-4"><button onClick={onReset} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"><RefreshCcw size={17} />Reset demo data</button></div>
    </aside>
  )
}

function Topbar({ view, onMenu, onAddLead }: { view: View; onMenu: () => void; onAddLead: () => void }) {
  const titles = { dashboard: ['Operations overview', 'Your business at a glance'], leads: ['Lead CRM', 'Manage relationships and opportunities'], tasks: ['Task manager', 'Keep every next step on track'] }
  return (
    <header className="sticky top-0 z-20 flex h-[73px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3"><button className="rounded-xl border border-slate-200 p-2.5 text-slate-600 lg:hidden" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button><div><h1 className="text-base font-bold text-slate-900 sm:text-lg">{titles[view][0]}</h1><p className="hidden text-xs text-slate-500 sm:block">{titles[view][1]}</p></div></div>
      <div className="flex items-center gap-2 sm:gap-3"><button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50" aria-label="Notifications"><Bell size={18} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white" /></button><button className="btn-primary !px-3 sm:!px-4" onClick={onAddLead}><Plus size={17} /><span className="hidden sm:inline">Add lead</span></button></div>
    </header>
  )
}

function Dashboard({ leads, tasks, totalPipeline, conversion, overdue, pipelineData, onViewLeads, onViewTasks }: { leads: Lead[]; tasks: Task[]; totalPipeline: number; conversion: number; overdue: number; pipelineData: { status: LeadStatus; leads: number }[]; onViewLeads: () => void; onViewTasks: () => void }) {
  const activeTasks = tasks.filter((task) => !task.completed).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 4)
  const suggestions = useMemo(() => leads.filter((lead) => !['Won', 'Lost'].includes(lead.status)).map((lead) => {
    const days = Math.floor((Date.now() - new Date(`${lead.lastContact}T12:00:00`).getTime()) / 86400000)
    let suggestion = ''
    if (lead.status === 'New' && days >= 2) suggestion = 'Make first contact and confirm their primary need.'
    else if (lead.status === 'Contacted' && days >= 5) suggestion = 'Send a concise check-in with one clear next step.'
    else if (lead.status === 'Qualified' && days >= 7) suggestion = 'Schedule a solution review or share a tailored recap.'
    else if (lead.status === 'Proposal' && days >= 5) suggestion = 'Follow up on the proposal and ask about decision timing.'
    return suggestion ? { ...lead, days, suggestion } : null
  }).filter(Boolean).sort((a, b) => (b?.days ?? 0) - (a?.days ?? 0)).slice(0, 3), [leads]) as (Lead & { days: number; suggestion: string })[]

  const cards = [
    { label: 'Total leads', value: leads.length.toString(), note: `${leads.filter((l) => l.status === 'New').length} new to review`, icon: Users, tone: 'indigo' },
    { label: 'Conversion rate', value: `${conversion}%`, note: `${leads.filter((l) => l.status === 'Won').length} opportunities won`, icon: TrendingUp, tone: 'emerald' },
    { label: 'Pipeline value', value: shortCurrency.format(totalPipeline), note: 'Open opportunities', icon: CircleDollarSign, tone: 'violet' },
    { label: 'Overdue tasks', value: overdue.toString(), note: overdue ? 'Needs attention today' : 'Everything is on track', icon: Clock3, tone: 'rose' },
  ]
  const tones: Record<string, string> = { indigo: 'bg-indigo-50 text-indigo-600', emerald: 'bg-emerald-50 text-emerald-600', violet: 'bg-violet-50 text-violet-600', rose: 'bg-rose-50 text-rose-600' }
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-indigo-600">{new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Good morning, Operator</h2><p className="mt-2 text-sm text-slate-500">Here’s what’s happening across your business today.</p></div><div className="flex items-center gap-2 text-xs font-medium text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-500" />Saved locally</div></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, note, icon: Icon, tone }) => <div key={label} className="panel p-5"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{value}</p></div><span className={`grid h-11 w-11 place-items-center rounded-xl ${tones[tone]}`}><Icon size={21} /></span></div><p className="mt-3 text-xs text-slate-500">{note}</p></div>)}</div>
      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <ChartPanel title="Revenue trend" subtitle="Closed revenue over the last 6 months" action={<span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500"><CalendarDays size={14} />Last 6 months</span>}><ResponsiveContainer width="100%" height={270}><AreaChart data={revenueData} margin={{ top: 12, right: 8, left: -12, bottom: 0 }}><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} /><stop offset="100%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="month" axisLine={false} tickLine={false} dy={10} /><YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} /><Tooltip formatter={(value) => [currency.format(Number(value)), 'Revenue']} contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 10px 25px rgba(15,23,42,.08)' }} /><Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fill="url(#revenueFill)" /></AreaChart></ResponsiveContainer></ChartPanel>
        <ChartPanel title="Lead pipeline" subtitle="Opportunities by current stage" action={<button onClick={onViewLeads} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">View CRM</button>}><ResponsiveContainer width="100%" height={270}><BarChart data={pipelineData} margin={{ top: 12, right: 4, left: -28, bottom: 0 }}><CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="status" axisLine={false} tickLine={false} dy={10} tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 12 }} /><Bar dataKey="leads" radius={[6, 6, 0, 0]} maxBarSize={36}>{pipelineData.map((entry) => <Cell key={entry.status} fill={entry.status === 'Won' ? '#10b981' : entry.status === 'Lost' ? '#cbd5e1' : '#818cf8'} />)}</Bar></BarChart></ResponsiveContainer></ChartPanel>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <section className="panel overflow-hidden"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div><h3 className="font-bold text-slate-900">Upcoming tasks</h3><p className="mt-1 text-xs text-slate-500">Your next actions, sorted by due date</p></div><button onClick={onViewTasks} className="flex items-center gap-1 text-xs font-semibold text-indigo-600">All tasks <ArrowRight size={14} /></button></div>{activeTasks.length ? <div className="divide-y divide-slate-100">{activeTasks.map((task) => <div key={task.id} className="flex items-center gap-4 px-5 py-4 sm:px-6"><span className={`h-2 w-2 shrink-0 rounded-full ${task.priority === 'High' ? 'bg-rose-500' : task.priority === 'Medium' ? 'bg-amber-400' : 'bg-slate-300'}`} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{task.title}</p><p className="mt-0.5 truncate text-xs text-slate-500">{task.relatedTo || 'General'}</p></div><div className={`text-right text-xs font-medium ${task.dueDate < todayIso() ? 'text-rose-600' : 'text-slate-500'}`}>{task.dueDate < todayIso() ? 'Overdue · ' : ''}{formatDate(task.dueDate)}</div></div>)}</div> : <EmptyState icon={CheckCircle2} title="No active tasks" text="Add a task to start planning your next steps." />}</section>
        <section className="panel overflow-hidden"><div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div className="flex gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600"><Sparkles size={17} /></span><div><div className="flex items-center gap-2"><h3 className="font-bold text-slate-900">Follow-up suggestions</h3><span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">Rules</span></div><p className="mt-1 text-xs text-slate-500">Based on stage and days since contact — not AI predictions</p></div></div></div>{suggestions.length ? <div className="divide-y divide-slate-100">{suggestions.map((item) => <div key={item.id} className="px-5 py-4 sm:px-6"><div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{item.name} · {item.company}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.suggestion}</p></div><span className="shrink-0 rounded-lg bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-600">{item.days}d ago</span></div></div>)}</div> : <EmptyState icon={Check} title="Follow-ups are current" text="No rule-based reminders are due right now." />}</section>
      </div>
    </div>
  )
}

function ChartPanel({ title, subtitle, action, children }: { title: string; subtitle: string; action: ReactNode; children: ReactNode }) {
  return <section className="panel p-5 sm:p-6"><div className="mb-5 flex items-start justify-between gap-4"><div><h3 className="font-bold text-slate-900">{title}</h3><p className="mt-1 text-xs text-slate-500">{subtitle}</p></div>{action}</div>{children}</section>
}

function Leads({ leads, onAdd, onEdit, onDelete, onExport }: { leads: Lead[]; onAdd: () => void; onEdit: (lead: Lead) => void; onDelete: (lead: Lead) => void; onExport: () => void }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<LeadStatus | 'All'>('All')
  const filtered = leads.filter((lead) => (status === 'All' || lead.status === status) && [lead.name, lead.company, lead.email].some((value) => value.toLowerCase().includes(search.toLowerCase())))
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="text-2xl font-bold tracking-tight text-slate-950">Your lead pipeline</h2><p className="mt-2 text-sm text-slate-500">Track conversations, values, and every deal stage.</p></div><div className="flex gap-2"><button className="btn-secondary" onClick={onExport} disabled={!leads.length}><Download size={17} />Export CSV</button><button className="btn-primary" onClick={onAdd}><Plus size={17} />Add lead</button></div></div>
      <div className="grid gap-4 sm:grid-cols-3"><MiniStat label="Open pipeline" value={currency.format(leads.filter((l) => !['Won', 'Lost'].includes(l.status)).reduce((sum, l) => sum + l.value, 0))} icon={Target} /><MiniStat label="Qualified & proposal" value={leads.filter((l) => ['Qualified', 'Proposal'].includes(l.status)).length.toString()} icon={TrendingUp} /><MiniStat label="Won value" value={currency.format(leads.filter((l) => l.status === 'Won').reduce((sum, l) => sum + l.value, 0))} icon={CircleDollarSign} /></div>
      <section className="panel overflow-hidden"><div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div className="relative w-full sm:max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input className="input pl-10" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, company or email..." aria-label="Search leads" /></div><div className="relative"><Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><select className="input min-w-40 pl-9 pr-8" value={status} onChange={(e) => setStatus(e.target.value as LeadStatus | 'All')} aria-label="Filter by status"><option>All</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></div></div>
        {filtered.length ? <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead><tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500"><th className="px-5 py-3.5">Contact</th><th className="px-4 py-3.5">Status</th><th className="px-4 py-3.5">Value</th><th className="px-4 py-3.5">Last contact</th><th className="px-4 py-3.5">Source</th><th className="px-5 py-3.5 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((lead) => <tr key={lead.id} className="group hover:bg-slate-50/60"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">{lead.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div><p className="text-sm font-semibold text-slate-900">{lead.name}</p><p className="mt-0.5 text-xs text-slate-500">{lead.company} · {lead.email}</p></div></div></td><td className="px-4 py-4"><StatusBadge status={lead.status} /></td><td className="px-4 py-4 text-sm font-semibold text-slate-800">{currency.format(lead.value)}</td><td className="px-4 py-4 text-sm text-slate-600">{formatDate(lead.lastContact)}</td><td className="px-4 py-4 text-sm text-slate-600">{lead.source}</td><td className="px-5 py-4"><div className="flex justify-end gap-1"><button className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600" onClick={() => onEdit(lead)} aria-label={`Edit ${lead.name}`}><Edit3 size={16} /></button><button className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" onClick={() => onDelete(lead)} aria-label={`Delete ${lead.name}`}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div> : <EmptyState icon={Users} title={leads.length ? 'No matching leads' : 'No leads yet'} text={leads.length ? 'Try adjusting your search or status filter.' : 'Add your first lead to start building the pipeline.'} action={!leads.length ? <button className="btn-primary" onClick={onAdd}><Plus size={16} />Add first lead</button> : undefined} />}
        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Showing {filtered.length} of {leads.length} leads</div>
      </section>
    </div>
  )
}

function MiniStat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Target }) {
  return <div className="panel flex items-center gap-4 p-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><Icon size={19} /></span><div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-lg font-bold text-slate-900">{value}</p></div></div>
}

function Tasks({ tasks, onAdd, onEdit, onDelete, onToggle }: { tasks: Task[]; onAdd: () => void; onEdit: (task: Task) => void; onDelete: (task: Task) => void; onToggle: (id: string) => void }) {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All')
  const filtered = tasks.filter((task) => filter === 'All' || (filter === 'Completed' ? task.completed : !task.completed)).sort((a, b) => Number(a.completed) - Number(b.completed) || a.dueDate.localeCompare(b.dueDate))
  return (
    <div className="space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="text-2xl font-bold tracking-tight text-slate-950">Tasks & next steps</h2><p className="mt-2 text-sm text-slate-500">A focused list of work that keeps opportunities moving.</p></div><button className="btn-primary self-start sm:self-auto" onClick={onAdd}><Plus size={17} />Add task</button></div>
      <div className="grid gap-4 sm:grid-cols-3"><MiniStat label="Active tasks" value={tasks.filter((t) => !t.completed).length.toString()} icon={CheckCircle2} /><MiniStat label="Due today" value={tasks.filter((t) => !t.completed && t.dueDate === todayIso()).length.toString()} icon={CalendarDays} /><MiniStat label="Completed" value={tasks.filter((t) => t.completed).length.toString()} icon={Check} /></div>
      <section className="panel overflow-hidden"><div className="flex items-center justify-between border-b border-slate-100 p-4 sm:px-5"><div className="inline-flex rounded-xl bg-slate-100 p-1">{(['All', 'Active', 'Completed'] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${filter === item ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{item}</button>)}</div><span className="hidden text-xs text-slate-500 sm:block">{filtered.length} task{filtered.length === 1 ? '' : 's'}</span></div>
        {filtered.length ? <div className="divide-y divide-slate-100">{filtered.map((task) => { const isOverdue = !task.completed && task.dueDate < todayIso(); return <div key={task.id} className={`flex items-start gap-3 px-4 py-4 transition hover:bg-slate-50/70 sm:items-center sm:gap-4 sm:px-5 ${task.completed ? 'opacity-60' : ''}`}><button onClick={() => onToggle(task.id)} className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition sm:mt-0 ${task.completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 hover:border-indigo-500'}`} aria-label={task.completed ? `Mark ${task.title} incomplete` : `Complete ${task.title}`}>{task.completed && <Check size={12} strokeWidth={3} />}</button><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className={`text-sm font-semibold ${task.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{task.title}</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${priorityStyles[task.priority]}`}>{task.priority}</span></div><div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">{task.relatedTo && <span className="flex items-center gap-1"><Building2 size={13} />{task.relatedTo}</span>}<span className={`flex items-center gap-1 ${isOverdue ? 'font-semibold text-rose-600' : ''}`}><CalendarDays size={13} />{isOverdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}</span></div></div><div className="flex shrink-0 gap-1"><button className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}><Edit3 size={16} /></button><button className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`}><Trash2 size={16} /></button></div></div>})}</div> : <EmptyState icon={CheckCircle2} title={tasks.length ? `No ${filter.toLowerCase()} tasks` : 'No tasks yet'} text={tasks.length ? 'Switch filters to see other work.' : 'Create your first task and give it a clear due date.'} action={!tasks.length ? <button className="btn-primary" onClick={onAdd}><Plus size={16} />Add first task</button> : undefined} />}
      </section>
    </div>
  )
}

function EmptyState({ icon: Icon, title, text, action }: { icon: typeof Users; title: string; text: string; action?: ReactNode }) {
  return <div className="flex flex-col items-center px-6 py-14 text-center"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400"><Icon size={22} /></span><h3 className="mt-4 text-sm font-bold text-slate-800">{title}</h3><p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">{text}</p>{action && <div className="mt-5">{action}</div>}</div>
}

export default App
