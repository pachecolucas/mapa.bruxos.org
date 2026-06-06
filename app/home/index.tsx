"use client";

import Mapa from "@/components/Mapa";
import { Ceu, DadosNatais, getCeu } from "../model";
import { useState } from "react";

type Props = {
  ceu: Ceu;
};

export default function Index({ ceu: ceuInicial }: Props) {
  const [ceu, setCeu] = useState(ceuInicial);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-180">
        <Mapa ceu={ceu} />
      </div>
    </div>
  );
}
