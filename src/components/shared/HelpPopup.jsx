import { useState } from 'react'

function hasBeenSeen(storageKey) {
  try {
    if (localStorage.getItem(storageKey) === '1') return true
    localStorage.setItem(storageKey, '1')
    return false
  } catch {
    return true // localStorage unavailable - just don't auto-show, not fatal.
  }
}

// A small "how to use this" popup. Shows itself once automatically the
// first time a feature is opened (tracked per-feature in localStorage),
// and stays reachable afterwards via a floating button.
export default function HelpPopup({ id, title = 'How to use this', children }) {
  const [open, setOpen] = useState(() => !hasBeenSeen(`help-seen-${id}`))

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="How to use this feature"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-lg font-bold text-white shadow-lg shadow-teal-500/40 transition hover:scale-105"
      >
        {!open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-40" />}
        <span className="relative">{open ? '×' : '?'}</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-72 max-w-[calc(100vw-3rem)] rounded-2xl border border-teal-300/60 bg-white/90 p-5 shadow-2xl shadow-teal-500/20 backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h4 className="flex items-center gap-1.5 text-sm font-bold text-teal-700">
              <span aria-hidden>✨</span> {title}
            </h4>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-slate-400 hover:text-slate-600">
              ✕
            </button>
          </div>
          <div className="text-sm leading-snug text-slate-600">{children}</div>
        </div>
      )}
    </>
  )
}
