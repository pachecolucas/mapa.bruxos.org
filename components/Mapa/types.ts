export type Casa = {
  numero: number;
  grau: number; // longitude absoluta (0–360)
  nome: "AC" | "IC" | "DC" | "MC" | null;
};

export interface Planeta {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  // mapa
  longitude: number; // fonte de posição (0–360)
  latitude: number;
  distancia: number;
  velocidade: number;
  retrogrado: boolean;
  // casa / rótulo
  signo: number;
  grau2: number; // grau dentro do signo (0–29)
  minuto: number;
  segundo: number;
}
