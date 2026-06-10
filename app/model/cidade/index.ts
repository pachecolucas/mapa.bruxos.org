import { DateTime } from "luxon";
import { Cadastro } from "../cadastro";

export type Cidade = {
  id: number;
  nome: string;
  pais: string;
  latitude: number;
  longitude: number;
  timezone: string;
  populacao: string;
};

export async function cidade_list(search: string): Promise<Cidade[]> {
  console.log(`https://app.epanel.com.br/api/v1/1/bruxos/cidade?search=${search}`);
  const result = await fetch(`https://app.epanel.com.br/api/v1/1/bruxos/cidade?search=${search}`);
  const { rows: cidades } = await result.json();
  return cidades;
}

export async function cidade_getUtcOffset(c: Cadastro) {
  const dt = DateTime.fromObject({ year: c.ano, month: c.mes, day: c.dia, hour: c.hora, minute: c.minuto, second: c.segundo ?? 0 }, { zone: c.cidade.timezone });
  return dt.offset / 60; // offset em horas (ex.: -2 ou -3)
}
