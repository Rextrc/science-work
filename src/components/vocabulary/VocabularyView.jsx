import { useEffect, useState } from 'react'
import { loadTerms, saveTerms } from '../../genetics/vocabulary'
import FlashCard from './FlashCard'

function shuffle(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function VocabularyView() {
  const [terms, setTerms] = useState(() => loadTerms())
  const [order, setOrder] = useState(() => terms.map((_, i) => i))
  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState('study') // 'study' | 'quiz'
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState({ got: 0, missed: 0 })

  useEffect(() => saveTerms(terms), [terms])

  const card = terms[order[index]]

  function switchMode(next) {
    setMode(next)
    setRevealed(false)
  }

  function goTo(delta) {
    setIndex((i) => (i + delta + order.length) % order.length)
    setRevealed(false)
  }

  function handleShuffle() {
    setOrder(shuffle(terms.map((_, i) => i)))
    setIndex(0)
    setRevealed(false)
  }

  function updateDefinition(newDefinition) {
    setTerms((prev) => prev.map((t, i) => (i === order[index] ? { ...t, definition: newDefinition } : t)))
  }

  function markQuiz(result) {
    setScore((s) => ({ ...s, [result]: s[result] + 1 }))
    goTo(1)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Vocabulary</h1>
        <p className="mt-1 text-slate-600">
          Key terms from your inheritance chapter. Fill in each definition yourself, then switch to Quiz mode to
          self-test.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="inline-flex rounded-lg border border-slate-300 bg-slate-100 p-1">
          <button
            onClick={() => switchMode('study')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
              mode === 'study' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Study
          </button>
          <button
            onClick={() => switchMode('quiz')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
              mode === 'quiz' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Quiz
          </button>
        </div>
        <button onClick={handleShuffle} className="text-sm font-medium text-slate-500 hover:text-slate-700">
          Shuffle
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <FlashCard
          key={card.id}
          card={card}
          revealed={revealed}
          onToggle={() => setRevealed((r) => !r)}
          onEdit={updateDefinition}
          editableWhenRevealed={mode === 'study'}
        />

        {mode === 'quiz' && revealed ? (
          <div className="flex gap-3">
            <button
              onClick={() => markQuiz('got')}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Got it
            </button>
            <button
              onClick={() => markQuiz('missed')}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
            >
              Missed it
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => goTo(-1)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              ← Prev
            </button>
            <span className="text-sm text-slate-400">
              {index + 1} / {order.length}
            </span>
            <button
              onClick={() => goTo(1)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Next →
            </button>
          </div>
        )}

        {mode === 'quiz' && score.got + score.missed > 0 && (
          <p className="text-sm text-slate-500">
            Session score: {score.got} got it · {score.missed} missed
          </p>
        )}
      </div>
    </div>
  )
}
