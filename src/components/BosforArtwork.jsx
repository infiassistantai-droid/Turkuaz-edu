import { cn } from '../lib/utils'

export function ModelAsset({ name, className }) {
  return <img className={cn('bosfor-model', className)} src={`/images/bosfor/${name}.png`} alt="" draggable={false} />
}

export function PanelHeading({ name, title, titleId, description, children }) {
  return (
    <div className="bosfor-panel-heading">
      <div className="bosfor-panel-emblem"><ModelAsset name={name} /></div>
      <div className="bosfor-panel-copy">
        <h2 id={titleId}>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="bosfor-panel-tools">{children}</div>}
    </div>
  )
}

export function SectionBanner({ name, title, titleId, description, children }) {
  return (
    <header className="bosfor-section-banner" data-model={name}>
      <div className="bosfor-banner-copy">
        <h1 id={titleId}>{title}</h1>
        {description && <p>{description}</p>}
        {children && <div className="bosfor-banner-details">{children}</div>}
      </div>
      <div className="bosfor-banner-scene" aria-hidden="true">
        <span />
        <ModelAsset name={name} />
      </div>
    </header>
  )
}
