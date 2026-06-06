"use client";

import Mapa from "@/components/Mapa";
import { Casa, Planeta } from "@/components/Mapa/types";
import { Aspecto } from "@/lib/aspectos";

type Props = {
  casas: Casa[];
  planetas: Planeta[];
  aspectos: Aspecto[];
};

export default function Index({ casas, planetas, aspectos }: Props) {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-180">
        <Mapa casas={casas} planetas={planetas} aspectos={aspectos} />
      </div>
    </div>
  );
}
