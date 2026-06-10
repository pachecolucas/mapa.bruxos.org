"use server";

import { SistemaCasas } from "../astro/casas";
import { Cidade, cidade_getUtcOffset } from "../cidade";

export type Cadastro = {
  id: number;
  nome: string;
  cidade: Cidade;
  ano: number; // ex.: 1984
  mes: number; // 1-12
  dia: number; // 1-31
  hora: number; // hora LOCAL, 0-23
  minuto: number; // 0-59
  segundo: number; // 0-59 (opcional)
  /** Offset do fuso em horas, onde `local = UT + utcOffset`. Ex.: Brasília = -3. */
  utcOffset: number;
  /** Sistema de casas. Padrão: Placidus ('P'). */
  sistemaCasas: SistemaCasas;
};

const cadastros: Cadastro[] = [
  {
    id: 1,
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
    nome: "Elisa Floriani Teixeira",
    cidade: {
      id: 3469968,
      nome: "Blumenau",
      pais: "BR",
      latitude: -26.91944,
      longitude: -49.06611,
      timezone: "America/Sao_Paulo",
      populacao: "361855",
    },
    ano: 2020,
    mes: 3,
    dia: 23,
    hora: 18,
    minuto: 47,
    segundo: 0,
    utcOffset: -3,
    sistemaCasas: "P",
  },
  {
    id: 4,
    nome: "Francisco Floriani Teixeira",
    cidade: {
      id: 3463237,
      nome: "Florianópolis",
      pais: "BR",
      latitude: -27.59667,
      longitude: -48.54917,
      timezone: "America/Sao_Paulo",
      populacao: "508826",
    },
    ano: 2025,
    mes: 9,
    dia: 21,
    hora: 23,
    minuto: 23,
    segundo: 0,
    utcOffset: -3,
    sistemaCasas: "P",
  },
  {
    id: 5,
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
  const list = [...cadastros];
  for (const c of list) {
    const utcOffset = await cidade_getUtcOffset(c);
    c.utcOffset = c.utcOffset == undefined ? utcOffset : c.utcOffset;
  }
  return list;
}

export async function cadastro_getById(id: number): Promise<Cadastro> {
  const list = await cadastro_list();
  const cadastro = list.find((c) => c.id == id)!;
  return cadastro;
}

export async function cadastro_agora(): Promise<Cadastro> {
  const d = new Date();

  const agora: Cadastro = {
    id: 0,
    nome: "Agora",
    ano: d.getFullYear(),
    mes: d.getMonth() + 1, // getMonth() é 0–11, por isso o +1
    dia: d.getDate(), // getDate() : dia do mês (getDay() seria dia da semana!)
    hora: d.getHours(),
    minuto: d.getMinutes(),
    segundo: 0, // 0-59 (opcional)
    utcOffset: 0,
    cidade: {
      id: 3463237,
      nome: "Florianópolis",
      pais: "BR",
      latitude: -27.59667,
      longitude: -48.54917,
      timezone: "America/Sao_Paulo",
      populacao: "508826",
    },
    sistemaCasas: "P",
  };
  agora.utcOffset = await cidade_getUtcOffset(agora);

  return agora;
}
