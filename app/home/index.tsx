"use client";

import Mapa from "@/components/Mapa";
import { Ceu, DadosNatais, getCeu } from "../model";
import { useState } from "react";

type Props = {
  ceu: Ceu;
  dados: DadosNatais;
};

export default function Index({ ceu: ceuInicial, dados: dadosInicial }: Props) {
  const [dados, setDados] = useState(dadosInicial);
  const [ceu, setCeu] = useState(ceuInicial);

  async function handleChange(novosDados: DadosNatais) {
    setDados(novosDados);
    const novoCeu = await getCeu(novosDados);
    setCeu(novoCeu);
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-180">
        {JSON.stringify(dados)}
        <input type="number" value={dados.hora} max={59} min={0} onChange={(e) => handleChange({ ...dados, hora: +e.target.value })} />
        <Mapa ceu={ceu} />
      </div>
    </div>
  );
}
