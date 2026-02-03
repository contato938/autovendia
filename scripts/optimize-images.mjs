#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converte imagens PNG para WebP com compressão otimizada
 * Reduz tamanho em ~70% mantendo qualidade visual
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

const imagesToOptimize = [
  'Autovend IA - Logo Horizontal sem fundo.png',
  'Autovend IA - Logo Horizontal cor branca sem fundo.png',
  'Autovend IA - Logo Vertical sem fundo.png',
  'Autovend IA - Logo Vertical cor branca sem fundo.png',
  'Autovend IA - Simbolo sem fundo.png',
];

console.log('🖼️  Iniciando otimização de imagens...\n');

// Verificar se sharp está instalado
try {
  execSync('npm list sharp', { stdio: 'ignore' });
} catch {
  console.log('📦 Instalando sharp para otimização...');
  execSync('npm install --save-dev sharp', { stdio: 'inherit' });
}

// Importar sharp dinamicamente
const { default: sharp } = await import('sharp');

let totalOriginalSize = 0;
let totalOptimizedSize = 0;

for (const imageName of imagesToOptimize) {
  const inputPath = path.join(publicDir, imageName);
  const outputPath = path.join(publicDir, imageName.replace('.png', '.webp'));

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Arquivo não encontrado: ${imageName}`);
    continue;
  }

  const originalStats = fs.statSync(inputPath);
  const originalSize = originalStats.size;
  totalOriginalSize += originalSize;

  try {
    // Converter para WebP com qualidade 85 (ótimo balanço qualidade/tamanho)
    await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);

    const optimizedStats = fs.statSync(outputPath);
    const optimizedSize = optimizedStats.size;
    totalOptimizedSize += optimizedSize;

    const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

    console.log(`✅ ${imageName}`);
    console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB`);
    console.log(`   WebP: ${(optimizedSize / 1024).toFixed(1)}KB`);
    console.log(`   Redução: ${reduction}%\n`);
  } catch (error) {
    console.error(`❌ Erro ao processar ${imageName}:`, error.message);
  }
}

const totalReduction = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1);

console.log('\n📊 Resumo da Otimização:');
console.log(`   Total Original: ${(totalOriginalSize / 1024).toFixed(1)}KB`);
console.log(`   Total WebP: ${(totalOptimizedSize / 1024).toFixed(1)}KB`);
console.log(`   Redução Total: ${totalReduction}%`);
console.log('\n✨ Otimização concluída!');
console.log('💡 Próximo passo: Atualizar componentes para usar as imagens WebP\n');
