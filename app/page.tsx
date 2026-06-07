import Home from "./home";
import { DadosNatais, getCeu } from "./model";

export default async function Page() {
  const dados: DadosNatais = DADOS_NATAIS.taciana;

  const ceu = await getCeu(dados);

  return (
    <div>
      <Home ceu={ceu} dados={dados} />
    </div>
  );
}

const DADOS_NATAIS: Record<string, DadosNatais> = {
  taciana: {
    nome: "Taciana Floriani",
    cidade: "Taió",
    ano: 1988,
    mes: 11,
    dia: 11,
    hora: 11,
    minuto: 30,
    segundo: 0,
    utcOffset: -2,
    latitude: -(27 + 6 / 60),
    longitude: -(49 + 0 / 59 + 53 / 3600),
    sistemaCasas: "P",
  },
  lucas: {
    nome: "Lucas Pacheco Teixeira",
    cidade: "Tubarão",
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
