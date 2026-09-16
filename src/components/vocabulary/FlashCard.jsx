import { useState } from 'react'

// Keyed by card.id from the parent, so a new card remounts this
// component fresh instead of needing an effect to reset local state.
export default function FlashCard({ card, revealed, onToggle, onEdit, editableWhenRevealed }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(card.definition)

  return (
    <div
      onClick={() => !editing && onToggle()}
      className="flex h-64 w-full max-w-md cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-md transition hover:shadow-lg"
    >
      {!revealed ? (
        <span className="text-3xl font-bold text-slate-900">{card.term}</span>
      ) : editing ? (
        <textarea
          autoFocus
          value={draft}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            onEdit(draft)
            setEditing(false)
          }}
          placeholder="Write your own definition here, in your own words..."
          className="h-32 w-full resize-none rounded-lg border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
        />
      ) : (
        <>
          <span className="text-sm text-slate-500">
            {card.definition || 'No definition yet — click "Edit" to add your own.'}
          </span>
          {editableWhenRevealed && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setEditing(true)
              }}
              className="text-xs font-medium text-teal-700 hover:text-teal-800"
            >
              Edit definition
            </button>
          )}
        </>
      )}
      {!editing && (
        <span className="text-xs text-slate-400">{revealed ? 'Click to see term' : 'Click to flip'}</span>
      )}
    </div>
  )
}
