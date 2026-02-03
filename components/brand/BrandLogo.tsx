"use client"

import * as React from "react"
import Image from "next/image"

type BrandLogoVariant = "horizontal" | "vertical" | "symbol"
type BrandLogoMode = "auto" | "light" | "dark"

const LOGOS = {
  horizontal: {
    light: "/Autovend IA - Logo Horizontal sem fundo.webp",
    dark: "/Autovend IA - Logo Horizontal cor branca sem fundo.webp",
  },
  vertical: {
    light: "/Autovend IA - Logo Vertical sem fundo.webp",
    dark: "/Autovend IA - Logo Vertical cor branca sem fundo.webp",
  },
  symbol: {
    light: "/Autovend IA - Simbolo sem fundo.webp",
    dark: "/Autovend IA - Simbolo sem fundo.webp",
  },
} satisfies Record<BrandLogoVariant, { light: string; dark: string }>

// Dimensões aproximadas dos logos (em pixels)
const LOGO_DIMENSIONS = {
  horizontal: { width: 600, height: 150 },
  vertical: { width: 300, height: 400 },
  symbol: { width: 200, height: 200 },
}

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
  const { width, height } = LOGO_DIMENSIONS[variant]

  // Sempre renderiza a versão colorida original do arquivo
  return (
    <span className={`inline-block relative ${className}`} aria-label={alt} title={alt}>
      <Image 
        src={light} 
        alt={alt} 
        width={width}
        height={height}
        className="w-full h-full object-contain"
        priority={variant === "horizontal"} // Logo principal tem prioridade
        quality={90}
      />
    </span>
  )
}
