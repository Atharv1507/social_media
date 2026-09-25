import { useState } from 'react'
import { BadgeCheck, EllipsisVertical, Heart, MessageCircle, Send } from 'lucide-react'
import Avatar from '../ui/Avatar'

const compact = new Intl.NumberFormat('en', { notation: 'compact' })

// Full-bleed photo card with glass author chip and stats over a bottom scrim.
function PostCard({ post }) {
  const [liked, setLiked] = useState(false)
  const likes = post.likes + (liked ? 1 : 0)

  return (
    <article className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-ochre-light shadow-sm">
      <img
        src={post.image}
        alt={`Post by ${post.author}`}
        loading="lazy"
        width="900"
        height="1125"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-3">
        <div className="glass-dark flex min-w-0 items-center gap-2.5 rounded-full p-1.5 pr-4 text-white">
          <Avatar src={post.avatar} name={post.author} size="h-10 w-10" />
          <div className="min-w-0">
            <p className="flex items-center gap-1 truncate text-[15px] font-semibold leading-tight">
              {post.author}
              <BadgeCheck size={16} className="shrink-0 fill-verified text-white" aria-label="Verified" />
            </p>
            <p className="truncate text-xs font-medium text-white/80">@{post.handle} · {post.time}</p>
          </div>
        </div>
        <button type="button" aria-label="More options" className="glass-dark flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white">
          <EllipsisVertical size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pb-5 pt-20 text-white">
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-pressed={liked}
            aria-label={liked ? 'Unlike' : 'Like'}
            onClick={() => setLiked((value) => !value)}
            className="flex h-11 items-center gap-1.5 rounded-full px-2.5 text-sm font-semibold tabular-nums transition hover:bg-white/10"
          >
            <Heart size={20} className={liked ? 'fill-live text-live' : ''} aria-hidden="true" />
            {compact.format(likes)}
          </button>
          <button type="button" aria-label="Comments" className="flex h-11 items-center gap-1.5 rounded-full px-2.5 text-sm font-semibold tabular-nums transition hover:bg-white/10">
            <MessageCircle size={20} aria-hidden="true" />
            {compact.format(post.comments)}
          </button>
          <button type="button" aria-label="Share" className="flex h-11 items-center gap-1.5 rounded-full px-2.5 text-sm font-semibold tabular-nums transition hover:bg-white/10">
            <Send size={19} aria-hidden="true" />
            {compact.format(post.shares)}
          </button>
        </div>
        <p className="mt-1 px-2.5 text-[15px] font-medium leading-snug">
          {post.caption}{' '}
          {post.tags.map((tag) => (
            <span key={tag} className="text-white/85">#{tag} </span>
          ))}
        </p>
      </div>
    </article>
  )
}

export default PostCard
