import { useEffect, useRef, useState } from 'react';
import CardWrapper from './CardWrapper';
export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  function submit(event) {
    event.preventDefault();
    if (!title.trim()) { inputRef.current?.focus(); return; }
    onAdd({ title: title.trim(), description: description.trim(), priority, dueDate });
    setTitle(''); setDescription(''); setPriority('medium'); setDueDate('');
    inputRef.current?.focus();
  }
  return <CardWrapper className="form-panel"><div className="section-heading"><span className="section-icon">＋</span><div><h2>Create a task</h2><p>Make room for your next idea.</p></div></div><form onSubmit={submit}><label htmlFor="title">Task name <span className="required">*</span></label><input id="title" ref={inputRef} value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs to get done?" maxLength={120} required/><label htmlFor="description">Description <span className="optional">optional</span></label><textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Add a little more detail…" maxLength={1000} rows={3}/><div className="form-grid"><div><label htmlFor="priority">Priority</label><select id="priority" value={priority} onChange={e => setPriority(e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div><div><label htmlFor="dueDate">Due date <span className="optional">optional</span></label><input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}/></div></div><button className="primary-button add-button" type="submit"><span>＋</span> Add task</button><p className="form-hint">One small task. One step forward.</p></form></CardWrapper>;
}
