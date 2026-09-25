function PageLoader() {
  return (
    <div className="grid min-h-dvh place-items-center bg-canvas" role="status">
      <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-ochre/25 border-t-ochre" />
      <span className="sr-only">Loading</span>
    </div>
  )
}

export default PageLoader
