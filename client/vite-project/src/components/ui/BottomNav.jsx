import { Link } from 'react-router-dom'
import { Compass, Heart, House, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const baseItem = 'flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-200'
const activeItem = `${baseItem} bg-white text-ink shadow-md`
const idleItem = `${baseItem} text-white/85 hover:bg-white/10 hover:text-white`

// Floating glass pill navigation. `active` is one of: home | explore | activity | profile
function BottomNav({ active }) {
  const { user } = useAuth()

  const items = [
    { id: 'home', label: 'Home', icon: House, to: '/home' },
    { id: 'explore', label: 'Explore (coming soon)', icon: Compass },
    { id: 'activity', label: 'Activity (coming soon)', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User, to: `/profile/${user?.username}` },
  ]

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
      <nav aria-label="Main" className="glass-dark pointer-events-auto flex items-center gap-2 rounded-full p-2 shadow-2xl shadow-ink/30">
        {items.map(({ id, label, icon: Icon, to }) => {
          const isActive = active === id
          const className = isActive ? activeItem : idleItem
          const icon = <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} fill={isActive && id !== 'explore' ? 'currentColor' : 'none'} aria-hidden="true" />

          return to ? (
            <Link key={id} to={to} aria-label={label} aria-current={isActive ? 'page' : undefined} className={className}>
              {icon}
            </Link>
          ) : (
            <button key={id} type="button" aria-label={label} title="Coming soon" className={className}>
              {icon}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default BottomNav
