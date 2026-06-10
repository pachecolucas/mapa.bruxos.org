"use server";

import { calcularPlanetas, Planeta as PlanetaBackend } from "./astro/planetas";
import { Aspecto, calcularAspectos } from "./astro/aspectos";
import { calcularCasas, ResultadoCasas } from "./astro/casas";
import { Casa, Planeta } from "@/components/Mapa/types";
import { cidade_list } from "./cidade";
import { DateTime } from "luxon";
import sweph from "sweph";
import { Cadastro } from "./cadastro";

export type Ceu = {
  planetas: Planeta[];
  casas: Casa[];
  aspectos: Aspecto[];
};

export async function getCeu(entrada: Cadastro) {
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
    mostrar: true,
  }));
}

export async function getCidades(search: string) {
  return await cidade_list(search);
}

// substitui o utcOffset manual: recebe a hora LOCAL + a zona IANA da cidade
export async function getUtc(dados: Cadastro) {
  const dt = DateTime.fromObject(
    {
      year: dados.ano,
      month: dados.mes,
      day: dados.dia,
      hour: dados.hora,
      minute: dados.minuto,
      second: dados.segundo ?? 0,
    },
    { zone: dados.cidade.timezone }, // ex.: "America/Sao_Paulo"
  );

  if (!dt.isValid) {
    throw new Error(`Data/zona inválida: ${dt.invalidReason} — ${dt.invalidExplanation}`);
  }

  const utc = dt.toUTC(); // instante absoluto em UTC

  // ATENÇÃO: use os componentes do UTC, não os locais — perto da meia-noite o dia muda.
  const horaUT = utc.hour + utc.minute / 60 + utc.second / 3600;
  return sweph.julday(utc.year, utc.month, utc.day, horaUT, sweph.constants.SE_GREG_CAL);
}
