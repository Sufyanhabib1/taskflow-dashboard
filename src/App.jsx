import { useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/functional/Header';
import MetricsSummary from './components/functional/MetricsSummary';
import TaskForm from './components/functional/TaskForm';
import TaskList from './components/functional/TaskList';
import ActivityLogger from './components/class/ActivityLogger';
const validTasks = value => Array.isArray(value) && value.every(t => t && typeof t.id === 'string' && typeof t.title === 'string' && typeof t.description === 'string' && ['low','medium','high'].includes(t.priority) && typeof t.completed === 'boolean' && typeof t.dueDate === 'string');
function Dashboard() {
  const [tasks, setTasks, storageError] = useLocalStorage('taskflow-tasks', [], validTasks);
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [search, setSearch] = useState('');
  const [event, setEvent] = useState(null);
  const log = useCallback((message, type = 'update') => setEvent({ id: crypto.randomUUID(), message, type, time: new Date().toISOString() }), []);
  const pending = tasks.filter(t => !t.completed).length;
  useEffect(() => { document.title = `${pending} pending · TaskFlow`; }, [pending]);
  const addTask = useCallback(data => { setTasks(previous => [{ ...data, id: crypto.randomUUID(), completed: false, createdAt: new Date().toISOString() }, ...previous]); log(`Added “${data.title}”`, 'add'); }, [setTasks, log]);
  const toggleTask = useCallback(id => { const task = tasks.find(t => t.id === id); if (!task) return; setTasks(previous => previous.map(t => t.id === id ? { ...t, completed: !t.completed } : t)); log(`${task.completed ? 'Reopened' : 'Completed'} “${task.title}”`, 'complete'); }, [tasks, setTasks, log]);
  const deleteTask = useCallback(id => { const task = tasks.find(t => t.id === id); if (!task) return; setTasks(previous => previous.filter(t => t.id !== id)); log(`Deleted “${task.title}”`, 'delete'); }, [tasks, setTasks, log]);
  const changeStatus = useCallback(value => { if (value === status) return; setStatus(value); log(`Status filter changed to ${value}`, 'filter'); }, [status, log]);
  const changePriority = useCallback(value => { if (value === priority) return; setPriority(value); log(`Priority filter changed to ${value}`, 'filter'); }, [priority, log]);
  const clearCompleted = useCallback(() => { const count = tasks.filter(t => t.completed).length; setTasks(previous => previous.filter(t => !t.completed)); log(`Cleared ${count} completed ${count === 1 ? 'task' : 'tasks'}`, 'delete'); }, [tasks, setTasks, log]);
  const filteredTasks = useMemo(() => tasks.filter(task => (status === 'all' || (status === 'completed' ? task.completed : !task.completed)) && (priority === 'all' || task.priority === priority) && `${task.title} ${task.description}`.toLowerCase().includes(search.toLowerCase().trim())), [tasks, status, priority, search]);
  const completed = tasks.length - pending;
  return <><Header/><main><div className="page-heading"><div><div className="eyebrow">YOUR PERSONAL COMMAND CENTER</div><h1>A clear mind. A focused day<span>.</span></h1><p>Keep your tasks in order and your momentum going.</p></div><div className="today"><span>Today</span><strong>{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</strong></div></div>{storageError && <p className="storage-warning" role="alert">Browser storage is unavailable. Your tasks will remain for this session but may not survive a refresh.</p>}<MetricsSummary tasks={tasks}/><div className="dashboard-grid"><div className="left-column"><TaskForm onAdd={addTask}/><section className="progress-card"><div className="progress-heading"><span>Keep moving forward</span><strong>{tasks.length ? Math.round(completed / tasks.length * 100) : 0}%</strong></div><div className="progress-track" role="progressbar" aria-label="Tasks completed" aria-valuemin={0} aria-valuemax={100} aria-valuenow={tasks.length ? Math.round(completed/tasks.length*100) : 0}><div style={{width:`${tasks.length ? completed/tasks.length*100 : 0}%`}}/></div><p>{completed} of {tasks.length} tasks completed. Every step counts.</p></section></div><div className="right-column"><TaskList tasks={filteredTasks} total={tasks.length} status={status} priority={priority} search={search} onStatus={changeStatus} onPriority={changePriority} onSearch={setSearch} onToggle={toggleTask} onDelete={deleteTask} onClearCompleted={clearCompleted} completed={completed}/><ActivityLogger event={event}/></div></div><footer className="page-footer"><span className="footer-brand">✓ TaskFlow</span><span>A little structure for the things that matter.</span><span>React · Local workspace</span></footer></main></>;
}
export default function App() { return <ThemeProvider><Dashboard/></ThemeProvider>; }
