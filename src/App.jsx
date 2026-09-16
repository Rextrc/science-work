import { useState } from 'react'
import VocabularyView from './components/vocabulary/VocabularyView'
import PunnettSection from './components/punnett/PunnettSection'
import PedigreeView from './components/pedigree/PedigreeView'

const TABS = [
  { id: 'vocabulary', label: 'Vocabulary', Component: VocabularyView },
  { id: 'punnett', label: 'Punnett Squares', Component: PunnettSection },
  { id: 'pedigree', label: 'Pedigree Chart', Component: PedigreeView },
]

export default function App() {
  const [tab, setTab] = useState(TABS[0].id)
  const Active = TABS.find((t) => t.id === tab).Component

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-8 gap-y-2 px-6 py-4">
          <span className="text-lg font-bold text-teal-700">Mendelian Genetics Lab</span>
          <nav className="flex flex-wrap gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  tab === t.id ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="px-6 py-10">
        <Active />
      </main>
    </div>
  )
}
