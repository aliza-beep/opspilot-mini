import type { Lead, Task } from './types'

const daysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().slice(0, 10)
}

const daysFromNow = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

export const createDemoLeads = (): Lead[] => [
  { id: 'lead-1', name: 'Maya Chen', company: 'Northstar Labs', email: 'maya@example.test', status: 'Qualified', value: 18500, lastContact: daysAgo(3), source: 'Referral' },
  { id: 'lead-2', name: 'Elias Hart', company: 'Harbor & Pine', email: 'elias@example.test', status: 'Proposal', value: 32000, lastContact: daysAgo(8), source: 'Website' },
  { id: 'lead-3', name: 'Priya Raman', company: 'Lumen Works', email: 'priya@example.test', status: 'Won', value: 24000, lastContact: daysAgo(5), source: 'Event' },
  { id: 'lead-4', name: 'Jon Bell', company: 'Fieldstone Co.', email: 'jon@example.test', status: 'New', value: 7200, lastContact: daysAgo(6), source: 'Outbound' },
  { id: 'lead-5', name: 'Nadia Cruz', company: 'Solis Studio', email: 'nadia@example.test', status: 'Contacted', value: 12800, lastContact: daysAgo(11), source: 'Website' },
  { id: 'lead-6', name: 'Theo Park', company: 'Tandem Freight', email: 'theo@example.test', status: 'Won', value: 41500, lastContact: daysAgo(18), source: 'Referral' },
  { id: 'lead-7', name: 'Sam Okafor', company: 'Canopy Health', email: 'sam@example.test', status: 'Lost', value: 9600, lastContact: daysAgo(24), source: 'Event' },
  { id: 'lead-8', name: 'Leila Ford', company: 'Aster Finance', email: 'leila@example.test', status: 'Qualified', value: 27500, lastContact: daysAgo(9), source: 'Outbound' },
]

export const createDemoTasks = (): Task[] => [
  { id: 'task-1', title: 'Send revised proposal', relatedTo: 'Harbor & Pine', priority: 'High', dueDate: daysFromNow(-2), completed: false },
  { id: 'task-2', title: 'Prepare discovery notes', relatedTo: 'Northstar Labs', priority: 'Medium', dueDate: daysFromNow(1), completed: false },
  { id: 'task-3', title: 'Schedule product walkthrough', relatedTo: 'Lumen Works', priority: 'Low', dueDate: daysFromNow(4), completed: true },
  { id: 'task-4', title: 'Confirm budget owner', relatedTo: 'Aster Finance', priority: 'High', dueDate: daysFromNow(-1), completed: false },
  { id: 'task-5', title: 'Share onboarding checklist', relatedTo: 'Tandem Freight', priority: 'Medium', dueDate: daysFromNow(3), completed: false },
]

export const revenueData = [
  { month: 'May', revenue: 18000 },
  { month: 'Jun', revenue: 26500 },
  { month: 'Jul', revenue: 22000 },
  { month: 'Aug', revenue: 31500 },
  { month: 'Sep', revenue: 39000 },
  { month: 'Oct', revenue: 46800 },
]
