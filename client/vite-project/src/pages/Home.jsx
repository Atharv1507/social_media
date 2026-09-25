import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Clapperboard, ImagePlus, LayoutGrid, Paperclip, Plus, X } from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import Avatar from '../components/ui/Avatar'
import BottomNav from '../components/ui/BottomNav'
import PostCard from '../components/feed/PostCard'
import { posts, stories, suggestions } from '../data/demo'

const compact = new Intl.NumberFormat('en', { notation: 'compact' })

function Home() {
  const { user } = useAuth()
  // UI-only composer. Post and reel APIs will be connected in class.
  const [contentType, setContentType] = useState('post')
  const [caption, setCaption] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  const handleContentTypeChange = (type) => {
    setContentType(type)
    setSelectedFile(null)
  }

  const firstName = user?.name?.split(' ')[0] || 'there'
  const profilePath = `/profile/${user?.username}`

  return (
    <div className="min-h-dvh bg-canvas pb-36">
      <header className="sticky top-0 z-30 bg-canvas/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <button type="button" aria-label="Menu" className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-ink shadow-sm transition hover:shadow-md">
            <LayoutGrid size={20} aria-hidden="true" />
          </button>
          <Link to="/home" className="text-2xl font-medium tracking-tight">SST Social</Link>
          <button type="button" aria-label="Notifications" className="relative flex h-12 w-12 items-center justify-center rounded-full bg-surface text-ink shadow-sm transition hover:shadow-md">
            <Bell size={20} aria-hidden="true" />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-surface bg-live" />
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 justify-center gap-8 xl:grid-cols-[260px_minmax(0,36rem)_260px]">
        {/* Left rail: your mini profile (desktop only) */}
        <aside className="hidden xl:block">
          <div className="sticky top-24 overflow-hidden rounded-[28px] bg-surface shadow-sm">
            <div className="h-20 bg-ochre" />
            <div className="-mt-9 px-5 pb-5 text-center">
              <Avatar src={user?.profileImage} name={user?.name} size="h-[72px] w-[72px] text-2xl" className="mx-auto border-4 border-surface" />
              <p className="mt-2 truncate text-lg font-semibold">{user?.name}</p>
              <p className="truncate text-sm font-medium text-ochre-deep">@{user?.username}</p>
              <dl className="mt-4 grid grid-cols-2 divide-x divide-line">
                <div>
                  <dt className="text-xs font-medium text-muted">Followers</dt>
                  <dd className="text-lg font-semibold tabular-nums">{compact.format(user?.followers?.length || 0)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted">Following</dt>
                  <dd className="text-lg font-semibold tabular-nums">{compact.format(user?.followings?.length || 0)}</dd>
                </div>
              </dl>
              <Link to={profilePath} className="mt-4 flex h-11 items-center justify-center rounded-full bg-soft text-sm font-semibold transition hover:bg-line">
                View profile
              </Link>
            </div>
          </div>
        </aside>

        <main className="min-w-0 px-4 xl:px-0">
          {/* Stories */}
          <section aria-label="Stories" className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 pt-1 xl:mx-0 xl:scroll-px-0 xl:px-0">
            <Link to={profilePath} className="flex w-[76px] shrink-0 snap-start flex-col items-center gap-2">
              <span className="relative rounded-full p-[3px] ring-2 ring-line">
                <Avatar src={user?.profileImage} name={user?.name} size="h-[64px] w-[64px] text-xl" />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-canvas bg-ochre text-white">
                  <Plus size={14} strokeWidth={3} aria-hidden="true" />
                </span>
              </span>
              <span className="w-full truncate text-center text-sm font-medium">Your story</span>
            </Link>

            {stories.map((story) => (
              <button key={story.name} type="button" className="group flex w-[76px] shrink-0 snap-start flex-col items-center gap-2">
                <span className="relative rounded-full bg-gradient-to-tr from-ochre to-maroon p-[3px] transition-transform duration-200 group-hover:scale-105">
                  <img src={story.image} alt="" className="h-[64px] w-[64px] rounded-full border-[3px] border-canvas object-cover" />
                  {story.live && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full border-2 border-canvas bg-ink px-2 py-px text-[11px] font-semibold text-white">
                      Live
                    </span>
                  )}
                </span>
                <span className="w-full truncate text-center text-sm font-medium">{story.name}</span>
              </button>
            ))}
          </section>

          {/* Post and reel composer UI; publishing will be connected in class. */}
          <form onSubmit={(event) => event.preventDefault()} className="mt-4 rounded-[28px] bg-surface p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <Avatar src={user?.profileImage} name={user?.name} size="h-11 w-11 text-sm" />
              <label htmlFor="composer" className="sr-only">Write a caption</label>
              <textarea
                id="composer"
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                maxLength={500}
                rows={1}
                placeholder={`What's on your mind, ${firstName}?`}
                className="min-h-11 flex-1 resize-none rounded-2xl bg-soft px-4 py-2.5 text-[15px] font-medium outline-none ring-ochre transition placeholder:text-muted focus:bg-surface focus:ring-2"
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div role="radiogroup" aria-label="Content type" className="flex rounded-full bg-soft p-1">
                {[
                  { id: 'post', label: 'Post', icon: ImagePlus },
                  { id: 'reel', label: 'Reel', icon: Clapperboard },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={contentType === id}
                    onClick={() => handleContentTypeChange(id)}
                    className={`flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition ${
                      contentType === id ? 'bg-ink text-white' : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </div>

              <label title={contentType === 'post' ? 'Choose image' : 'Choose video'} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ochre-deep transition hover:bg-soft">
                <Paperclip size={19} aria-hidden="true" />
                <span className="sr-only">{contentType === 'post' ? 'Choose image' : 'Choose video'}</span>
                <input
                  type="file"
                  accept={contentType === 'post' ? 'image/*' : 'video/*'}
                  onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                  className="sr-only"
                />
              </label>

              <button
                type="submit"
                disabled
                title="Publishing will be added in class"
                className="ml-auto h-11 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-50"
              >
                Share
              </button>
            </div>

            {selectedFile && (
              <div className="mt-3 flex items-center gap-2 rounded-2xl bg-soft px-3 py-2 text-sm font-medium text-ink-soft">
                <span className="min-w-0 flex-1 truncate">{selectedFile.name}</span>
                <button type="button" aria-label="Remove file" onClick={() => setSelectedFile(null)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-line">
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            )}
          </form>

          {/* Static preview: replace these cards with API data during the feed lesson. */}
          <section aria-label="Feed" className="mt-5 space-y-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>
        </main>

        {/* Right rail: suggestions (desktop only) */}
        <aside className="hidden xl:block">
          <div className="sticky top-24 rounded-[28px] bg-surface p-5 shadow-sm">
            <h2 className="text-base font-semibold">Suggested for you</h2>
            <ul className="mt-4 space-y-4">
              {suggestions.map((person) => (
                <li key={person.handle} className="flex items-center gap-3">
                  <Avatar src={person.avatar} name={person.name} size="h-11 w-11" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{person.name}</p>
                    <p className="truncate text-xs font-medium text-muted">@{person.handle}</p>
                  </div>
                  <button type="button" className="h-9 rounded-full bg-soft px-4 text-xs font-bold transition hover:bg-ink hover:text-white">
                    Follow
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <BottomNav active="home" />
    </div>
  )
}

export default Home
