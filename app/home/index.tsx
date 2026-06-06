"use client";

import Mapa from "@/components/Mapa";
import { Casa, Planeta } from "@/components/Mapa/types";
import { Aspecto } from "@/lib/aspectos";

type Props = {
  casas: Casa[];
  planetas: Planeta[];
  aspectos: Aspecto[];
  longitude: number;
};

export default function Index({ casas, longitude, planetas, aspectos }: Props) {
  console.log({ casas, planetas, aspectos, longitude });
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-180">
        <Mapa casas={casas} planetas={planetas} aspectos={aspectos} longitude={longitude} />
      </div>
    </div>
  );
}
