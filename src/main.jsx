import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './lib/i18n.jsx'
import { MascotProvider } from './context/MascotContext.jsx'
import Mascot from './components/Mascot.jsx'
import { WinterUpdateProvider } from './features/winter/WinterUpdateContext.jsx'
import './index.css'
import './features/winter/winter.css'

class RootErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[Turkuaz Edu] Uncaught render error:', error, info?.componentStack || '')
  }

  reload = () => {
    if (typeof window !== 'undefined') window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-slate-950 px-5 text-center text-white">
          <section role="alert" className="max-w-md rounded-2xl border border-white/10 bg-black/40 p-6 shadow-2xl">
            <h1 className="text-xl font-extrabold">Turkuaz Edu could not load</h1>
            <p className="mt-2 text-sm text-white/70">A temporary interface error occurred. Reload the app to try again.</p>
            <button type="button" onClick={this.reload} className="mt-5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950">
              Reload app
            </button>
          </section>
        </main>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <RootErrorBoundary>
    <React.StrictMode>
      <LanguageProvider>
        <WinterUpdateProvider>
          <MascotProvider>
            <App />
            <Mascot />
          </MascotProvider>
        </WinterUpdateProvider>
      </LanguageProvider>
    </React.StrictMode>
  </RootErrorBoundary>,
)
