import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { stories } from '../data/demo'

// Ochre backdrop + white sheet shared by Login and Signup.
export function AuthShell({ heading, subheading, errorMsg, footer, children }) {
  return (
    <div className="flex min-h-dvh flex-col bg-ochre lg:flex-row lg:items-center lg:justify-center lg:gap-16 lg:px-10">
      <section className="px-6 pb-8 pt-6 text-white lg:max-w-md lg:p-0">
        <div className="flex items-center gap-3">
          <Link to="/" aria-label="Back to welcome" className="glass-light flex h-11 w-11 items-center justify-center rounded-full">
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>
          <span className="text-lg font-semibold tracking-tight">SST Social</span>
        </div>

        <h1 className="mt-8 text-[44px] font-light leading-[1.05] tracking-tight sm:text-6xl lg:mt-12">
          {heading}
        </h1>
        <p className="mt-4 max-w-sm text-base font-medium text-ink">{subheading}</p>

        <div className="mt-8 hidden items-center gap-3 lg:flex" aria-hidden="true">
          <div className="flex -space-x-3">
            {stories.slice(0, 4).map((story) => (
              <img key={story.name} src={story.image} alt="" className="h-11 w-11 rounded-full border-2 border-ochre object-cover" />
            ))}
          </div>
          <p className="text-sm font-semibold text-ink">Join 12k+ people sharing today</p>
        </div>
      </section>

      <section className="flex-1 rounded-t-[36px] bg-surface px-6 pb-10 pt-8 shadow-2xl shadow-ink/10 lg:w-full lg:max-w-md lg:flex-none lg:rounded-[36px] lg:p-10">
        {errorMsg && (
          <div role="alert" className="mb-5 rounded-2xl bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">
            {errorMsg}
          </div>
        )}

        {children}

        <p className="mt-8 text-center text-sm font-medium text-muted">{footer}</p>
      </section>
    </div>
  )
}

// Dark pill with a white circle arrow, echoing the reference's CTA.
export function PillButton({ loading, loadingText, children, ...props }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-14 w-full items-center justify-between rounded-full bg-ink pl-6 pr-2 text-[15px] font-semibold text-white transition hover:bg-ink-soft active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      {...props}
    >
      <span>{loading ? loadingText : children}</span>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink">
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" aria-hidden="true" />
        ) : (
          <ArrowRight size={18} aria-hidden="true" />
        )}
      </span>
    </button>
  )
}
