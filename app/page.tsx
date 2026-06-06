import { calcularPlanetas, Planeta as PlanetaBackend } from "@/lib/planetas";
import { calcularAspectos } from "@/lib/aspectos";
import Home from "./home";
import { calcularCasas, DadosNatais, ResultadoCasas } from "@/lib/casas";
import { Casa, Planeta } from "@/components/Mapa/types";

const DADOS_NATAIS: Record<string, DadosNatais> = {
  lucas: {
    ano: 1984,
    mes: 12,
    dia: 1,
    hora: 9,
    minuto: 10,
    segundo: 0,
    utcOffset: -3,
    latitude: -(28 + 28 / 60),
    longitude: -(49 + 0 / 60 + 25 / 3600),
    sistemaCasas: "P",
  },
};

export default async function Page() {
  const entrada: DadosNatais = DADOS_NATAIS.lucas;

  const planetasRaw = calcularPlanetas(entrada);
  const casas = calcularCasas(entrada);

  const planetas = getPlanetas(planetasRaw);
  // aspectos: detecção é invariante; aqui guardamos os graus em longitude absoluta
  const aspectos = calcularAspectos(planetas.map((p) => ({ id: p.id, grau: p.longitude })));

  return (
    <div>
      <Home casas={getCasas(casas)} planetas={planetas} aspectos={aspectos} />
    </div>
  );
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
