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

export default function Index({ cadastros, ceu: ceuInicial, cadastro: cadastroInicial }: Props) {
  const [cadastro, setCadastro] = useState(cadastroInicial);
  const [ceu, setCeu] = useState(ceuInicial);

  const [searchCidade, setSearchCidade] = useState(cadastro.cidade.nome);
  const [cidades, setCidades] = useState<Cidade[]>([]);

  async function handleChangeCadastro(c: Cadastro, cidade?: Cidade) {
    if (cidade) {
      const { utcOffset } = await cadastro_getById(c.id, cidade);
      c.utcOffset = utcOffset;
    }
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
        <div className="font-semibold">{cadastro.nome}</div>
        <div>
          <input type="number" min={1} max={31} value={cadastro.dia} onChange={(e) => handleChangeCadastro({ ...cadastro, dia: +e.target.value })} />
          /
          <input type="number" min={1} max={12} value={cadastro.mes} onChange={(e) => handleChangeCadastro({ ...cadastro, mes: +e.target.value })} />
          /
          <input type="number" min={1800} max={3000} value={cadastro.ano} onChange={(e) => handleChangeCadastro({ ...cadastro, ano: +e.target.value })} />
          às
          <input type="number" min={0} max={23} value={cadastro.hora} onChange={(e) => handleChangeCadastro({ ...cadastro, hora: +e.target.value })} />
          :
          <input type="number" min={0} max={23} value={cadastro.minuto} onChange={(e) => handleChangeCadastro({ ...cadastro, minuto: +e.target.value })} />
          (<input type="number" min={-10} max={10} value={cadastro.utcOffset} onChange={(e) => handleChangeCadastro({ ...cadastro, utcOffset: +e.target.value })} />
          UTC)
        </div>
        <div>
          lon: {cadastro.cidade.longitude} lat: {cadastro.cidade.latitude}
        </div>
        <div className="relative">
          <input type="text" value={searchCidade} onChange={(e) => handleSearchCidade(e.target.value)} />
          {cidades.length > 0 && (
            <div className="flex flex-col text-xs gap-1 absolute top-5 left-0 bg-white p-2 rounded border/50 shadow">
              {cidades.map((c) => (
                <div key={c.id} onClick={() => handleChangeCidade(c)} className="hover:font-semibold cursor-pointer">
                  {c.nome} ({c.pais}){" "}
                  <span className="opacity-50">
                    {c.longitude}x{c.latitude}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <label>Cidade</label>
        </div>
        <div className="flex gap-2">
          <label>Mapas</label>
          {cadastros.map((c) => (
            <div key={c.id} onClick={() => handleChangeCadastro(c)}>
              {c.nome}
            </div>
          ))}
        </div>
        <Mapa ceu={ceu} />
      </div>
      <div>
        <pre className="text-xs">{JSON.stringify(cadastro, null, 2)}</pre>
      </div>
    </div>
  );
}
