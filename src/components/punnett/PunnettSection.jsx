import { useState } from 'react'
import PunnettSquareView from './PunnettSquareView'
import DihybridView from './DihybridView'
import BloodTypeView from './BloodTypeView'
import SexLinkedView from './SexLinkedView'

const SUB_TABS = [
  { id: 'monohybrid', label: 'Monohybrid', Component: PunnettSquareView },
  { id: 'dihybrid', label: 'Dihybrid', Component: DihybridView },
  { id: 'bloodtype', label: 'Codominance & Blood Types', Component: BloodTypeView },
  { id: 'sexlinked', label: 'Sex-Linked', Component: SexLinkedView },
]

export default function PunnettSection() {
  const [subTab, setSubTab] = useState(SUB_TABS[0].id)
  const Active = SUB_TABS.find((t) => t.id === subTab).Component

  return (
    <div className="space-y-8">
      <div className="mx-auto flex max-w-4xl flex-wrap gap-1 rounded-lg border border-slate-300 bg-slate-100 p-1">
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              subTab === t.id ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <Active />
    </div>
  )
}
