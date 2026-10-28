import { Component } from 'react';
import CardWrapper from '../functional/CardWrapper';
import { readStored } from '../../hooks/useLocalStorage';
const STORAGE_KEY = 'taskflow-activity';
export default class ActivityLogger extends Component {
  constructor(props) {
    super(props);
    this.state = { logs: [], toast: '', storageError: false };
    this.toastTimer = null;
  }
  componentDidMount() {
    const logs = readStored(STORAGE_KEY, [], value => Array.isArray(value) && value.every(log => log && typeof log.id === 'string' && typeof log.message === 'string' && typeof log.time === 'string'));
    this.setState({ logs: logs.slice(0, 50) });
  }
  componentDidUpdate(previousProps, previousState) {
    if (this.props.event && previousProps.event?.id !== this.props.event.id) {
      const event = this.props.event;
      this.setState(state => ({ logs: [event, ...state.logs].slice(0, 50), toast: event.message }));
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => this.setState({ toast: '' }), 3200);
    }
    if (previousState.logs !== this.state.logs) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.logs)); if (this.state.storageError) this.setState({ storageError: false }); }
      catch { if (!this.state.storageError) this.setState({ storageError: true }); }
    }
  }
  componentWillUnmount() { clearTimeout(this.toastTimer); }
  render() {
    return <><CardWrapper className="activity-panel"><div className="activity-heading"><h2><span>◴</span> Activity log</h2><span className="live-label"><i/> Live</span></div>{this.state.storageError && <p className="storage-warning">Activity could not be saved on this device.</p>}{this.state.logs.length ? <ol className="activity-list">{this.state.logs.slice(0, 8).map(log => <li key={log.id}><span className={`activity-dot ${log.type || ''}`}/><div><p>{log.message}</p><time dateTime={log.time}>{new Date(log.time).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</time></div></li>)}</ol> : <div className="activity-empty"><p>Your story starts here.</p><small>Task updates and filter changes will appear as you go.</small></div>}<p className="activity-footnote">{this.state.logs.length} recent events saved on this device</p></CardWrapper><div className={`toast ${this.state.toast ? 'visible' : ''}`} role="status" aria-live="polite">{this.state.toast && <>✓ <span>{this.state.toast}</span></>}</div></>;
  }
}
