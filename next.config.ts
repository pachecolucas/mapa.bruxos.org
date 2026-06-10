import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sweph"],
  // sweph é um addon nativo (.node). O Turbopack externaliza o módulo
  // mas não rastreia o binário para a função serverless na Vercel.
  // Este bloco força a cópia do .node para o bundle. NÃO REMOVER.
  outputFileTracingIncludes: {
    // ajuste a chave para a rota que realmente usa sweph.
    // ex: se for /api/mapa, use "/api/mapa". O "/**" pega tudo.
    "/**": ["./node_modules/sweph/**/*.node", "./node_modules/sweph/build/**", "./node_modules/sweph/prebuilds/**"],
  },
};

export default nextConfig;
