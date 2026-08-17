import { useEffect, useState } from 'react'
import { screensaverImages } from '../../data/screensaverImages'

export function Screensaver({ onWake }: { onWake: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const images = screensaverImages
  const hasImages = images.length > 0

  useEffect(() => {
    if (!hasImages) return
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % images.length)
    }, 12000)
    return () => clearInterval(interval)
  }, [hasImages, images.length])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#1a1a1a]"
      onClick={onWake}
      onKeyDown={onWake}
      onMouseMove={onWake}
      onTouchStart={onWake}
      role="button"
      tabIndex={0}
      aria-label="Sales Hub screensaver. Tryck på valfri tangent eller klicka för att återgå."
    >
      {hasImages ? (
        <div className="relative h-full w-full">
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                i === activeIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-[#f5f3ef]">
          <div className="select-none text-5xl font-semibold tracking-tight">ILVA</div>
          <div className="mt-2 select-none text-lg font-medium tracking-wide text-[#f5f3ef]/70">Sales Hub</div>
          <div className="mt-8 select-none text-sm text-[#f5f3ef]/50">
            Lägg till bilder i /public/screensaver/ för att aktivera bildspelet
          </div>
        </div>
      )}
    </div>
  )
}
