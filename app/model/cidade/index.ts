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
