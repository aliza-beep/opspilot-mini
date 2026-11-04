export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost'

export interface Lead {
  id: string
  name: string
  company: string
  email: string
  status: LeadStatus
  value: number
  lastContact: string
  source: string
}

export type TaskPriority = 'Low' | 'Medium' | 'High'

export interface Task {
  id: string
  title: string
  relatedTo: string
  priority: TaskPriority
  dueDate: string
  completed: boolean
}

export type View = 'dashboard' | 'leads' | 'tasks'
