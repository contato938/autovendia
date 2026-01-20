import fs from "fs";
import path from "path";

const projectRoot = process.cwd();
const nextDir = path.join(projectRoot, ".next");

try {
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
    // eslint-disable-next-line no-console
    console.log(`✅ Removido: ${nextDir}`);
  } else {
    // eslint-disable-next-line no-console
    console.log(`ℹ️ Nada para limpar (não existe): ${nextDir}`);
  }
} catch (err) {
  // eslint-disable-next-line no-console
  console.error("❌ Falha ao limpar .next:", err);
  process.exit(1);
}

