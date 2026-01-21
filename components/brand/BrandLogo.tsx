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
  const { light } = LOGOS[variant]

  // Sempre renderiza a versão colorida original do arquivo
  return (
    <span className={`inline-block ${className}`} aria-label={alt} title={alt}>
      <img src={light} alt={alt} className="w-full h-full object-contain" />
    </span>
  )
}
