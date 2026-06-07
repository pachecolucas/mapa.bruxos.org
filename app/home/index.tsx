"use client";

import Mapa from "@/components/Mapa";
import { Ceu, getCeu, getCidades } from "../model";
import { useState } from "react";
import { Cidade } from "../model/cidade";
import { Cadastro, cadastro_getById } from "../model/cadastro";

type Props = {
  ceu: Ceu;
  cadastro: Cadastro;
  cadastros: Cadastro[];
};

export default function Index({ cadastros, ceu: ceuInicial, cadastro: dadosInicial }: Props) {
  const [cadastro, setCadastro] = useState(dadosInicial);
  const [ceu, setCeu] = useState(ceuInicial);

  const [searchCidade, setSearchCidade] = useState(cadastro.cidade.nome);
  const [cidades, setCidades] = useState<Cidade[]>([]);

  async function handleChangeCadastro(c: Cadastro) {
    const { utcOffset } = await cadastro_getById(c.id);
    c.utcOffset = utcOffset;
    setCadastro(c);
    setSearchCidade(c.cidade.nome);
    const novoCeu = await getCeu(c);
    setCeu(novoCeu);
  }

  async function handleSearchCidade(search: string) {
    setSearchCidade(search);
    const cidadeList = await getCidades(search);
    setCidades(cidadeList);
  }

  async function handleChangeCidade(cidade: Cidade) {
    setCadastro({ ...cadastro, cidade });
    setCidades([]);
    setSearchCidade("");
  }

  return (
    <div className="flex justify-center gap-8">
      <div className="w-full max-w-180">
        <div className="flex gap-2">
          <label>Hora</label>
          <input type="number" value={cadastro.hora} max={59} min={0} onChange={(e) => handleChangeCadastro({ ...cadastro, hora: +e.target.value })} />
        </div>
        <div className="flex gap-2">
          <label>Cidade</label>
          <input type="text" value={searchCidade} onChange={(e) => handleSearchCidade(e.target.value)} />
          {cidades?.map((c) => (
            <div key={c.id} onClick={(e) => handleChangeCidade(c)}>
              {c.nome}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <label>Mapas</label>
          {cadastros.map((c) => (
            <div key={c.id} onClick={() => handleChangeCadastro(c)}>
              {c.nome}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <label>UTC</label>
          <input type="number" min={-10} max={10} value={cadastro.utcOffset} onChange={(e) => handleChangeCadastro({ ...cadastro, utcOffset: +e.target.value })} />
        </div>
        <Mapa ceu={ceu} />
      </div>
      <div>
        <pre className="text-xs">{JSON.stringify(cadastro, null, 2)}</pre>
      </div>
    </div>
  );
}
