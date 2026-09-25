import { Link } from 'react-router-dom'
import { ChevronsRight, Heart, Lock } from 'lucide-react'
import { landingPortrait, stories } from '../data/demo'

function Landing() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-ochre text-white">
      {/* Story-style progress bars, a nod to the reference onboarding. */}
      <div className="mx-auto flex w-full max-w-6xl gap-2 px-6 pt-4 lg:hidden" aria-hidden="true">
        <span className="h-1 flex-1 rounded-full bg-white" />
        <span className="h-1 flex-1 rounded-full bg-white/35" />
        <span className="h-1 flex-1 rounded-full bg-white/35" />
      </div>

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-5 lg:px-10 lg:pt-8">
        <span className="text-lg font-semibold tracking-tight">SST Social</span>
        <Link to="/login" className="glass-dark rounded-full px-5 py-2.5 text-sm font-semibold transition hover:bg-ink/60">
          Log in
        </Link>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 content-start gap-y-7 px-6 pb-6 pt-6 lg:grid-cols-[1.1fr_1fr] lg:content-center lg:gap-x-16 lg:px-10">
        <section className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <h1 className="text-[52px] font-light leading-[1.05] tracking-tight sm:text-7xl lg:text-[88px]">
            Join the <span className="font-normal text-maroon">social</span>
            <br />
            circle{' '}
            <span className="glass-light inline-flex h-[0.8em] translate-y-[0.05em] items-center rounded-full px-2 align-baseline" aria-hidden="true">
              {stories.slice(0, 3).map((story) => (
                <img key={story.name} src={story.image} alt="" className="-ml-2 h-[0.58em] w-[0.58em] rounded-full border-2 border-white/70 object-cover first:ml-0" />
              ))}
            </span>
            <br />
            that amplifies
            <br />
            your life.
          </h1>
          <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-ink sm:text-lg">
            Share moments, follow the people you love, and grow your circle in one warm corner of the internet.
          </p>
        </section>

        <figure className="@container relative mx-auto w-[70%] max-w-[320px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:w-full lg:max-w-md lg:self-center">
          <div className="absolute -inset-3 rounded-[calc(50cqw+12px)_calc(50cqw+12px)_52px_52px] border-2 border-dashed border-white/60" aria-hidden="true" />
          <img
            src={landingPortrait}
            alt="Smiling woman in warm golden light"
            width="900"
            height="1125"
            className="relative aspect-[4/5] w-full rounded-[50cqw_50cqw_40px_40px] bg-ochre-light object-cover"
          />
          <div className="glass-dark absolute -left-6 top-1/3 flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold shadow-lg">
            <Heart size={16} className="fill-live text-live" aria-hidden="true" />
            12.4k
          </div>
          <span className="absolute -right-3 top-12 rounded-full border-2 border-white bg-live px-3 py-1 text-xs font-bold uppercase tracking-wide">
            Live
          </span>
        </figure>

        <div className="relative z-10 -mt-20 lg:col-start-1 lg:row-start-2 lg:mt-0 lg:self-start">
          <Link
            to="/signup"
            className="glass-dark group mx-auto flex h-[68px] w-full max-w-sm items-center gap-4 rounded-full p-2 pr-6 shadow-xl shadow-ink/20 transition hover:bg-ink/60 lg:mx-0"
          >
            <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white text-ink transition group-hover:scale-105">
              <Lock size={20} aria-hidden="true" />
            </span>
            <span className="flex-1 text-lg font-medium">Let&apos;s get started</span>
            <ChevronsRight size={24} className="animate-nudge" aria-hidden="true" />
          </Link>
          <p className="mt-4 text-center text-sm font-medium text-ink lg:text-left">
            Already have an account?{' '}
            <Link to="/login" className="font-bold underline underline-offset-4">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default Landing
