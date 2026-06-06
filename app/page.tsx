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

  const planetas = getPlanetas(planetasRaw, casas);
  const aspectos = calcularAspectos(planetas);

  return (
    <div>
      <Home casas={getCasas(casas)} planetas={planetas} aspectos={aspectos} longitude={getLongitude(casas)} />
    </div>
  );
}

function getLongitude(casas: ResultadoCasas) {
  const ascendente = casas.cuspides[0];
  return 360 - ascendente.longitude;
}

function getCasas(casas: ResultadoCasas): Casa[] {
  const casa1 = casas.cuspides[0];
  const longitudeCasa1 = casa1.longitude;

  function getNome(numeroDaCasa: number) {
    if (numeroDaCasa == 1) return "AC";
    if (numeroDaCasa == 4) return "IC";
    if (numeroDaCasa == 7) return "DC";
    if (numeroDaCasa == 10) return "MC";
    return null;
  }

  function getGrau(longitudeDaCasa: number) {
    const result = longitudeDaCasa - longitudeCasa1;
    if (result < 0) return result + 360;
    return result;
  }

  return casas.cuspides.map((c) => {
    return {
      numero: c.casa,
      grau: getGrau(c.longitude),
      nome: getNome(c.casa),
    };
  });
}

/**
 * Glifo Unicode de cada corpo. Mantido aqui no page.tsx por enquanto
 * (decisão de visualização, não de cálculo). Mais tarde pode migrar
 * para junto da lista CORPOS no backend, se preferir uma fonte única.
 */
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

/**
 * Cor do glifo de cada corpo, em hex. Hex (e não classe Tailwind) porque
 * Tailwind precisa de classe estática; o atributo SVG `fill` aceita hex direto.
 */
const CORES_PLANETAS: Record<string, string> = {
  sol: "#D4A017", // dourado
  lua: "#4ADE80", // green
  mercurio: "#F97316", // laranja
  venus: "#EC4899", // rosa
  marte: "#DC2626", // vermelho
  jupiter: "#fbbf24", // dourado
  saturno: "#6B7280", // cinza
  urano: "#2563EB", // azul
  netuno: "#4ADE80", //
  plutao: "#000000", // preto
  nodo: "#000000", // preto (não especificado)
  quiron: "#000000", // preto (não especificado)
};

function getPlanetas(planetas: PlanetaBackend[], casas: ResultadoCasas): Planeta[] {
  const longitudeAC = casas.cuspides[0].longitude;

  function getGrau(longitudePlaneta: number) {
    const result = longitudePlaneta - longitudeAC;
    if (result < 0) return result + 360;
    return result;
  }

  return planetas.map((p) => ({
    id: p.id,
    nome: p.nome,
    icone: CARACTERES_PLANETAS[p.id] ?? "?",
    cor: CORES_PLANETAS[p.id] ?? "#000000",
    grau: getGrau(p.longitude),
    retrogrado: p.retrogrado,
  }));
}
