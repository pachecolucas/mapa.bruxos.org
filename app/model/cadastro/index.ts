"use server";

import { DateTime } from "luxon";
import { SistemaCasas } from "../astro/casas";
import { Cidade } from "../cidade";

const d = new Date();

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
  utcOffset?: number;
  /** Sistema de casas. Padrão: Placidus ('P'). */
  sistemaCasas?: SistemaCasas;
};

const cadastros: Cadastro[] = [
  {
    id: 1,
    nome: "Agora",
    cidade: {
      id: 3463237,
      nome: "Florianópolis",
      pais: "BR",
      latitude: -27.59667,
      longitude: -48.54917,
      timezone: "America/Sao_Paulo",
      populacao: "508826",
    },
    ano: d.getFullYear(),
    mes: d.getMonth() + 1, // getMonth() é 0–11, por isso o +1
    dia: d.getDate(), // getDate() = dia do mês (getDay() seria dia da semana!)
    hora: d.getHours(),
    minuto: d.getMinutes(),
    segundo: 0, // 0-59 (opcional)
    /** Offset do fuso em horas, onde `local = UT + utcOffset`. Ex.: Brasília = -3. */
    // utcOffset: 0,
    /** Sistema de casas. Padrão: Placidus ('P'). */
    sistemaCasas: "P",
  },
  {
    id: 2,
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
    id: 3,
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
    id: 4,
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
    return { ...c, utcOffset: c.utcOffset == undefined ? getUtcOffset(c) : c.utcOffset }; // offset em horas (ex.: -2 ou -3)
  });
}

export async function cadastro_getById(id: number, cidade?: Cidade): Promise<Cadastro> {
  const list = await cadastro_list();
  const cadastro = list.find((c) => c.id == id)!;
  if (cidade) {
    cadastro.cidade = cidade;
    cadastro.utcOffset = getUtcOffset(cadastro);
  }
  return cadastro;
}

export async function cadastro_agora(): Promise<Cadastro> {
  const list = await cadastro_list();
  return list[0];
}

function getUtcOffset(c: Cadastro): number {
  const dt = DateTime.fromObject({ year: c.ano, month: c.mes, day: c.dia, hour: c.hora, minute: c.minuto, second: c.segundo ?? 0 }, { zone: c.cidade.timezone });
  return dt.offset / 60; // offset em horas (ex.: -2 ou -3)
}
