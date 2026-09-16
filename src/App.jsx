import { useState } from 'react'
import PunnettSquareView from './components/punnett/PunnettSquareView'
import PedigreeView from './components/pedigree/PedigreeView'

const TABS = [
  { id: 'punnett', label: 'Punnett Square' },
  { id: 'pedigree', label: 'Pedigree Chart' },
]

export default function App() {
  const [tab, setTab] = useState('punnett')

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-8 px-6 py-4">
          <span className="text-lg font-bold text-teal-700">Mendelian Genetics Lab</span>
          <nav className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  tab === t.id
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="px-6 py-10">
        {tab === 'punnett' && <PunnettSquareView />}
        {tab === 'pedigree' && <PedigreeView />}
      </main>
    </div>
  )
}
