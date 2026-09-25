const getInitials = (name) =>
  name?.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'U'

function Avatar({ src, name, size = 'h-11 w-11', className = '' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || ''}
        loading="lazy"
        className={`${size} shrink-0 rounded-full bg-ochre-light object-cover ${className}`}
      />
    )
  }

  return (
    <div
      aria-label={name}
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-ochre-light font-semibold text-maroon ${className}`}
    >
      <span className="text-[0.8em]">{getInitials(name)}</span>
    </div>
  )
}

export default Avatar
