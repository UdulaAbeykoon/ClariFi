import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/setup-database'

createRoot(document.getElementById("root")!).render(<App />);
