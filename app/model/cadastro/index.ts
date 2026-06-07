"use server";

import { DateTime } from "luxon";
import { SistemaCasas } from "../astro/casas";
import { Cidade } from "../cidade";

export type Cadastro = {
  id: number;
  nome: string;
  cidade: Cidade;
  ano: number; // ex.: 1984
  mes: number; // 1-12
  dia: number; // 1-31
  hora: number; // hora LOCAL, 0-23
  minuto: number; // 0-59
  segundo?: number; // 0-59 (opcional)
  /** Offset do fuso em horas, onde `local = UT + utcOffset`. Ex.: Brasília = -3. */
  utcOffset: number;
  /** Sistema de casas. Padrão: Placidus ('P'). */
  sistemaCasas?: SistemaCasas;
};

const cadastros: Cadastro[] = [
  {
    id: 1,
    nome: "Taciana Floriani",
    cidade: {
      id: 3447063,
      latitude: -27.11639,
      longitude: -49.99806,
      nome: "Taió",
      pais: "BR",
      populacao: "18310",
      timezone: "America/Sao_Paulo",
    },
    ano: 1988,
    mes: 11,
    dia: 11,
    hora: 11,
    minuto: 30,
    segundo: 0,
    utcOffset: -2,
    sistemaCasas: "P",
  },
  {
    id: 2,
    nome: "Lucas Pacheco Teixeira",
    cidade: {
      id: 3445993,
      latitude: -28.46667,
      longitude: -49.00694,
      nome: "Tubarão",
      pais: "BR",
      populacao: "110088",
      timezone: "America/Sao_Paulo",
    },
    ano: 1984,
    mes: 12,
    dia: 1,
    hora: 9,
    minuto: 10,
    segundo: 0,
    utcOffset: -3,
    sistemaCasas: "P",
  },
  {
    id: 3,
    nome: "Prince (musician)",
    cidade: {
      id: 5037649,
      nome: "Minneapolis",
      pais: "US",
      latitude: 44.97997,
      longitude: -93.26384,
      timezone: "America/Chicago",
      populacao: "410939",
    },
    ano: 1958,
    mes: 6,
    dia: 7,
    hora: 18,
    minuto: 17,
    segundo: 0,
    utcOffset: 0,
    sistemaCasas: "P",
  },
];

export async function cadastro_list(): Promise<Cadastro[]> {
  return cadastros.map((c) => {
    const dt = DateTime.fromObject({ year: c.ano, month: c.mes, day: c.dia, hour: c.hora, minute: c.minuto, second: c.segundo ?? 0 }, { zone: c.cidade.timezone });
    return { ...c, utcOffset: dt.offset / 60 }; // offset em horas (ex.: -2 ou -3)
  });
}

export async function cadastro_getById(id: number): Promise<Cadastro> {
  const list = await cadastro_list();
  return list.find((c) => c.id == id)!;
}
