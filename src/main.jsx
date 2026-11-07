import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './lib/i18n.jsx'
import { WinterUpdateProvider } from './features/winter/WinterUpdateContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'
import './features/winter/winter.css'

const ROOT_ERROR_COPY = {
  title: 'Sahifa ochilmadi',
  body: 'Vaqtinchalik xatolik yuz berdi. Qayta yuklab ko‘ring.',
  retry: 'Qayta yuklash',
}

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
      const copy = ROOT_ERROR_COPY
      return (
        <main className="grid min-h-screen place-items-center bg-slate-950 px-4 py-8 text-center text-white sm:px-6">
          <section role="alert" aria-live="assertive" className="w-full max-w-md rounded-3xl border border-teal-300/20 bg-slate-900/90 p-6 shadow-2xl shadow-black/40 sm:p-8">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-teal-400/10 text-teal-200" aria-hidden="true">!</div>
            <h1 className="mt-4 text-xl font-extrabold">{copy.title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">{copy.body}</p>
            <button type="button" onClick={this.reload} className="mt-6 min-h-11 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-950/30 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">
              {copy.retry}
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
          <AuthProvider>
            <App />
          </AuthProvider>
        </WinterUpdateProvider>
      </LanguageProvider>
    </React.StrictMode>
  </RootErrorBoundary>,
)
