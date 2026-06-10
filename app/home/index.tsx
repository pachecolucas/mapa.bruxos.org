"use client";

import Mapa from "@/components/Mapa";
import { Ceu, getCeu, getCidades } from "../model";
import { useState } from "react";
import { Cidade, cidade_getUtcOffset } from "../model/cidade";
import { Cadastro, cadastro_agora, cadastro_getById } from "../model/cadastro";

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

  async function changeCadastro(id?: number) {
    const novoCadastro = id ? await cadastro_getById(id) : await cadastro_agora();
    afterChangeCadastro(novoCadastro);
  }

  async function handleChangeCadastro(c: Cadastro) {
    const novoCadastro = { ...c };
    if (cadastro.cidade?.id != novoCadastro.cidade?.id) {
      novoCadastro.utcOffset = await cidade_getUtcOffset(novoCadastro);
      console.log(novoCadastro.cidade);
    }
    afterChangeCadastro(novoCadastro);
  }

  async function handleSearchCidade(search: string) {
    setSearchCidade(search);
    const cidadeList = await getCidades(search);
    setCidades(cidadeList);
  }

  async function afterChangeCadastro(novoCadastro: Cadastro) {
    setCadastro(novoCadastro);
    setSearchCidade(novoCadastro.cidade.nome);
    setCidades([]);
    const novoCeu = await getCeu(novoCadastro);
    setCeu(novoCeu);
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
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <input type="text" value={searchCidade} onChange={(e) => handleSearchCidade(e.target.value)} />
            {cidades.length > 0 && (
              <div className="flex flex-col text-xs gap-1 absolute top-5 left-0 bg-white p-2 rounded border/50 shadow">
                {cidades.map((c) => (
                  <div key={c.id} onClick={() => handleChangeCadastro({ ...cadastro, cidade: c })} className="hover:font-semibold cursor-pointer">
                    {c.nome} ({c.pais}){" "}
                    <span className="opacity-50">
                      {c.longitude}x{c.latitude}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            lon
            <input
              type="number"
              min={-90}
              max={90}
              value={cadastro.cidade.longitude}
              onChange={(e) => handleChangeCadastro({ ...cadastro, cidade: { ...cadastro.cidade, longitude: +e.target.value } })}
              className="w-30"
            />{" "}
          </div>
          <div>
            lat
            <input
              type="number"
              min={-90}
              max={90}
              value={cadastro.cidade.latitude}
              onChange={(e) => handleChangeCadastro({ ...cadastro, cidade: { ...cadastro.cidade, latitude: +e.target.value } })}
              className="w-30"
            />
          </div>
          <div>
            offset <input type="number" min={-10} max={10} value={cadastro.utcOffset} onChange={(e) => handleChangeCadastro({ ...cadastro, utcOffset: +e.target.value })} />
          </div>
        </div>
        <Mapa ceu={ceu} />
      </div>
      <div>
        <label className="font-semibold">Mapas</label>
        <div className="flex gap-2">
          <div className="flex flex-col cursor-pointer">
            <div onClick={() => changeCadastro()} className="hover:font-semibold">
              Momento atual
            </div>
            {cadastros.map((c) => (
              <div key={c.id} onClick={() => changeCadastro(c.id)} className="hover:font-semibold">
                {c.nome}
              </div>
            ))}
          </div>
        </div>
        <br />
        <div className="flex flex-col">
          <label className="font-semibold">Céu</label>
          <label className="text-sm">Ascendente</label>
          <div>
            <input
              type="number"
              value={ceu.casas[0].grau}
              // min={0}
              // max={360}
              className="w-full"
              onChange={(e) => {
                let grau = +e.target.value;
                const casas_ = [...ceu.casas];
                for (const c of casas_) {
                  c.grau = grau;
                  grau += 30;
                }
                setCeu({ ...ceu, casas: casas_, aspectos: [] });
              }}
            />
          </div>
          <label className="text-sm">Planetas</label>
          {ceu.planetas.map((p) => (
            <div key={p.id}>
              <span className="font-astro">{p.icone}</span>
              <input
                type="number"
                value={p.longitude}
                onChange={(e) => {
                  const planetas_ = ceu.planetas.map((_) => {
                    if (_.id == p.id) return { ...p, longitude: +e.target.value };
                    return _;
                  });
                  setCeu({ ...ceu, planetas: planetas_, aspectos: [] });
                }}
              />
            </div>
          ))}
          <pre className="text-xs">{JSON.stringify(ceu.planetas, null, 2)}</pre>
        </div>
        <br />
        <pre className="text-xs">{JSON.stringify(cadastro, null, 2)}</pre>
      </div>
    </div>
  );
}
