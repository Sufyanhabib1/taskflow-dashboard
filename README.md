# TaskFlow — Web Engineering Assignment 01

A React task management and activity dashboard, ready for localhost. No backend or account is needed. Tasks, theme, and the latest 50 activity entries persist in this browser using localStorage.

## Run locally

Requires Node.js 20.19+ or 22+ for the development and test toolchain.

```powershell
npm install
npm run dev
```

Open the Local URL printed by Vite, normally http://127.0.0.1:5173.

```powershell
npm run build
npm run preview
```

The production build is generated in `dist/`.

## Features

- Add tasks with title, description, priority, and optional due date.
- Complete, reopen, delete tasks, or clear completed tasks.
- Combine status, priority, and text search filters.
- Live metrics and completion progress; overdue date indicators.
- Light and dark themes, responsive layout, keyboard accessible controls.
- Activity log and toast notifications for task actions and filter changes.
- Empty states and recovery from invalid stored JSON; storage failure messages.

## Assignment coverage

| Requirement | Implementation |
| --- | --- |
| Modular component architecture | `src/components/functional/` and `src/components/class/` |
| Functional views and callback props | Header, TaskForm, TaskList, TaskCard, MetricsSummary |
| React children | CardWrapper renders `children` in a reusable section |
| Class component state | ActivityLogger uses `this.state` and `this.setState` |
| componentDidMount | Restores stored activity history |
| componentDidUpdate | Consumes operation events, persists logs, and triggers toast timer |
| componentWillUnmount | Clears the notification timer |
| JSX expressions and conditions | Task metrics, priority indicators, completed styles, empty states |
| Array rendering and keys | Task, metric, filter, and activity lists use unique keys |
| Synthetic events | onSubmit, onChange, onClick |
| useState | Tasks, controlled form fields, filters, search, operation event |
| useEffect | Storage synchronization, input focus, theme, and pending-task document title |
| useContext | ThemeContext consumed by ThemeToggle without prop drilling |
| useRef | Task title autofocus at mount and after submission |
| useMemo | Combined task filtering |
| useCallback and memo | Stable callbacks and memoized TaskCard |
| Custom hook | useLocalStorage with parsing validation and write failure handling |

The task list starts empty. Add your own tasks to populate it. Browser data is scoped to the exact origin, so use the same localhost address and port to keep seeing saved tasks.

Live deployment and submission screenshots are left for a later step. The project runs locally using the commands above.

## Validation

Run `npm test` for DOM interaction checks covering task creation, autofocus, completion, filters, search, document title, notifications, theme persistence, localStorage restoration, invalid JSON recovery, clear completed, deletion, and logger cleanup.

Verified with Node.js 24. Use Node.js 20.19+ or 22+ for the complete development and test toolchain.
