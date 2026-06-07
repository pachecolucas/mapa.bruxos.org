"use client";

import Mapa from "@/components/Mapa";
import { Ceu, DadosNatais, getCeu } from "../model";
import { useState } from "react";

type Props = {
  ceu: Ceu;
  dados: DadosNatais;
};

export default function Index({ ceu: ceuInicial, dados: dadosInicial }: Props) {
  // https://app.epanel.com.br/api/v1/1/bruxos/cidade?search=imarui
  const [dados, setDados] = useState(dadosInicial);
  const [ceu, setCeu] = useState(ceuInicial);

  async function handleChange(novosDados: DadosNatais) {
    setDados(novosDados);
    const novoCeu = await getCeu(novosDados);
    setCeu(novoCeu);
  }

  async function handleChangeCidade(cidade: string) {
    setDados({ ...dados, cidade });
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-180">
        {JSON.stringify(dados)}
        <p className="flex gap-2">
          <label>Hora</label>
          <input type="number" value={dados.hora} max={59} min={0} onChange={(e) => handleChange({ ...dados, hora: +e.target.value })} />
        </p>
        <p className="flex gap-2">
          <label>Cidade</label>
          <input type="text" value={dados.cidade} onChange={(e) => handleChangeCidade(e.target.value)} />
        </p>
        <Mapa ceu={ceu} />
      </div>
    </div>
  );
}
