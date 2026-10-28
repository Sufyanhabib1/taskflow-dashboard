export default function MetricsSummary({ tasks }) {
  const completed = tasks.filter(task => task.completed).length;
  const pending = tasks.length - completed;
  const high = tasks.filter(task => !task.completed && task.priority === 'high').length;
  const metrics = [{label:'Total tasks',value:tasks.length,icon:'▤',style:'purple',hint:'Everything on your list'},{label:'Pending',value:pending,icon:'◷',style:'amber',hint:'Ready for your attention'},{label:'Completed',value:completed,icon:'✓',style:'green',hint:'Small wins, real progress'},{label:'High priority',value:high,icon:'↑',style:'rose',hint:'Your most important next steps'}];
  return <div className="metrics">{metrics.map(metric => <section className="metric panel" key={metric.label}><div><p>{metric.label}</p><strong>{metric.value}</strong></div><span className={`metric-icon ${metric.style}`}>{metric.icon}</span><small>{metric.hint}</small></section>)}</div>;
}
