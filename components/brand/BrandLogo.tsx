"use client"

import * as React from "react"

type BrandLogoVariant = "horizontal" | "vertical" | "symbol"
type BrandLogoMode = "auto" | "light" | "dark"

const LOGOS = {
  horizontal: {
    light: "/Autovend IA - Logo Horizontal sem fundo.png",
    dark: "/Autovend IA - Logo Horizontal cor branca sem fundo.png",
  },
  vertical: {
    light: "/Autovend IA - Logo Vertical sem fundo.png",
    dark: "/Autovend IA - Logo Vertical cor branca sem fundo.png",
  },
  symbol: {
    light: "/Autovend IA - Simbolo sem fundo.png",
    dark: "/Autovend IA - Simbolo sem fundo.png",
  },
} satisfies Record<BrandLogoVariant, { light: string; dark: string }>

export function BrandLogo({
  variant = "horizontal",
  mode = "auto",
  className,
  alt = "AUTOVEND IA",
}: {
  variant?: BrandLogoVariant
  mode?: BrandLogoMode
  className?: string
  alt?: string
}) {
  const { light, dark } = LOGOS[variant]

  if (mode === "light") {
    return (
      <span className={className} aria-label={alt} title={alt}>
        <img src={light} alt={alt} className="block w-full h-full object-contain" />
      </span>
    )
  }

  if (mode === "dark") {
    return (
      <span className={className} aria-label={alt} title={alt}>
        <img src={dark} alt={alt} className="block w-full h-full object-contain" />
      </span>
    )
  }

  return (
    <span className={className} aria-label={alt} title={alt}>
      <img src={light} alt={alt} className="block dark:hidden w-full h-full object-contain" />
      <img src={dark} alt={alt} className="hidden dark:block w-full h-full object-contain" />
    </span>
  )
}

