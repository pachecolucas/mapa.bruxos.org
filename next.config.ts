import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sweph"],
  outputFileTracingIncludes: {
    // ajuste a chave para a rota que realmente usa sweph.
    // ex: se for /api/mapa, use "/api/mapa". O "/**" pega tudo.
    "/**": ["./node_modules/sweph/**/*.node", "./node_modules/sweph/build/**", "./node_modules/sweph/prebuilds/**"],
  },
};

export default nextConfig;
