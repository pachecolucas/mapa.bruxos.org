"use server";

import { calcularPlanetas, Planeta as PlanetaBackend } from "./astro/planetas";
import { Aspecto, calcularAspectos } from "./astro/aspectos";
import { calcularCasas, ResultadoCasas, SistemaCasas } from "./astro/casas";
import { Casa, Planeta } from "@/components/Mapa/types";

export interface DadosNatais {
  nome: string;
  cidade: string;
  ano: number; // ex.: 1984
  mes: number; // 1-12
  dia: number; // 1-31
  hora: number; // hora LOCAL, 0-23
  minuto: number; // 0-59
  segundo?: number; // 0-59 (opcional)
  /** Offset do fuso em horas, onde `local = UT + utcOffset`. Ex.: Brasília = -3. */
  utcOffset: number;
  /** Latitude em graus decimais. Sul negativo. Ex.: 28°28'S → -28.466667 */
  latitude: number;
  /** Longitude em graus decimais. Oeste negativo. Ex.: 49°00'25"W → -49.006944 */
  longitude: number;
  /** Sistema de casas. Padrão: Placidus ('P'). */
  sistemaCasas?: SistemaCasas;
}

export type Ceu = {
  planetas: Planeta[];
  casas: Casa[];
  aspectos: Aspecto[];
};

export async function getCeu(entrada: DadosNatais) {
  const planetasRaw = calcularPlanetas(entrada);
  const casasRaw = calcularCasas(entrada);
  const aspectos = calcularAspectos(planetasRaw.map((p) => ({ id: p.id, grau: p.longitude })));

  const planetas = getPlanetas(planetasRaw);
  const casas = getCasas(casasRaw);

  return {
    casas,
    planetas,
    aspectos,
  };
}

function getCasas(casas: ResultadoCasas): Casa[] {
  function getNome(numeroDaCasa: number) {
    if (numeroDaCasa == 1) return "AC";
    if (numeroDaCasa == 4) return "IC";
    if (numeroDaCasa == 7) return "DC";
    if (numeroDaCasa == 10) return "MC";
    return null;
  }

  return casas.cuspides.map((c) => ({
    numero: c.casa,
    grau: c.longitude, // longitude absoluta (0–360)
    nome: getNome(c.casa),
  }));
}

const CARACTERES_PLANETAS: Record<string, string> = {
  sol: "A",
  lua: "B",
  mercurio: "C",
  venus: "D",
  marte: "E",
  jupiter: "F",
  saturno: "G",
  urano: "H",
  netuno: "I",
  plutao: "J",
  nodo: "K",
  quiron: "N",
};

const CORES_PLANETAS: Record<string, string> = {
  sol: "#D4A017",
  lua: "#4ADE80",
  mercurio: "#F97316",
  venus: "#EC4899",
  marte: "#DC2626",
  jupiter: "#fbbf24",
  saturno: "#6B7280",
  urano: "#2563EB",
  netuno: "#4ADE80",
  plutao: "#000000",
  nodo: "#000000",
  quiron: "#000000",
};

function getPlanetas(planetas: PlanetaBackend[]): Planeta[] {
  return planetas.map((p) => ({
    id: p.id,
    nome: p.nome,
    icone: CARACTERES_PLANETAS[p.id] ?? "?",
    cor: CORES_PLANETAS[p.id] ?? "#000000",
    // mapa — longitude absoluta é a fonte de posição
    longitude: p.longitude,
    latitude: p.latitude,
    distancia: p.distancia,
    velocidade: p.velocidade,
    retrogrado: p.retrogrado,
    // casa / rótulo
    signo: p.signoIndice,
    grau: p.grau, // grau dentro do signo (0–29) — só para o rótulo
    minuto: p.minuto,
    segundo: p.segundo,
  }));
}
