export default function AppLoading({ label, screen = false, theme }) {
  const Container = screen ? 'main' : 'div'

  return (
    <Container className={screen ? 'brand-loading brand-loading--screen' : 'brand-loading brand-loading--section'} data-loading-theme={theme} role="status" aria-busy="true">
      <div className="brand-loading-inner">
        <img className="brand-loading-icon" src="/icons/turkish-education.svg" alt="" width="72" height="72" />
        {screen && <strong>Turkuaz Edu</strong>}
        <p>{label}</p>
        <span className="brand-loading-track" aria-hidden="true" />
      </div>
    </Container>
  )
}
