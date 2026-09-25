const controlClass =
  'w-full bg-transparent text-[15px] font-medium text-ink placeholder:text-muted/70 outline-none disabled:opacity-60'

// Labelled input with a leading icon. Pass `textarea` to render a multi-line field.
function Field({ id, label, icon: Icon, textarea = false, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink-soft">
        {label}
      </label>
      <div className="flex items-start gap-3 rounded-2xl bg-soft px-4 ring-ochre transition focus-within:bg-surface focus-within:ring-2">
        {Icon && <Icon size={18} className="mt-[18px] shrink-0 text-muted" aria-hidden="true" />}
        {textarea ? (
          <textarea id={id} className={`${controlClass} min-h-24 resize-none py-4`} {...props} />
        ) : (
          <input id={id} className={`${controlClass} h-14`} {...props} />
        )}
      </div>
    </div>
  )
}

export default Field
