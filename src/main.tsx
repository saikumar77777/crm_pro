import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { checkEnvironment } from './config/env';

// Check environment configuration
const envCheck = checkEnvironment();
if (!envCheck.isValid) {
  console.warn("Environment configuration issues detected:", envCheck.issues);
}

createRoot(document.getElementById("root")!).render(<App />);
