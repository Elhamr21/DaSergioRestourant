"use client"

import { useState } from "react"

type LazyMapEmbedProps = {
  src: string
  title?: string
  className?: string
}

export function LazyMapEmbed({
  src,
  title = "Standort auf Google Maps",
  className,
}: LazyMapEmbedProps) {
  const [loaded, setLoaded] = useState(false)

  if (loaded) {
    return (
      <iframe
        src={src}
        title={title}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={className}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-muted px-6 text-center text-sm text-muted-foreground transition-colors hover:bg-muted/80 ${className ?? ""}`}
    >
      <span className="font-medium text-foreground">Karte laden</span>
      <span className="text-xs">
        Beim Laden wird eine Verbindung zu Google Maps hergestellt und Daten an Google übertragen.
      </span>
    </button>
  )
}
