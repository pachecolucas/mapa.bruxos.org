/**
 * Roda zodiacal com ASCENDENTE FIXO à esquerda (9 h).
 * Tudo (signos, casas, planetas, aspectos) é desenhado em longitude absoluta,
 * porém rotacionado por -ascLong: o grau do AC cai sempre no horizonte esquerdo
 * e os signos giram em volta. ascLong vem da cúspide da casa "AC".
 */

import { Casa, Planeta } from "./types";
import type { Aspecto } from "@/lib/aspectos";

const V = 400;
const cx = V / 2;
const cy = V / 2;
const rExterno = V / 2 - 4;
const rCentro = rExterno - 40;
const rSimbolo = (rExterno + rCentro) / 2;
const rPlaneta = 138;
const rLinhaExternaIni = rCentro;
const rLinhaExternaFim = 148;
const rLinhaInternaIni = 124;
const rLinhaInternaFim = 124;

const grausParaRad = (g: number): number => (g * Math.PI) / 180;

const FATIA_BASE = getFatia(0);
const ICONE_BASE = pos(rSimbolo, 15);
const ICONE_ROT_BASE = -(90 + 15);

const signos = [
  { id: 1, nome: "Áries", caracter: "a", fundo: "fill-amber-400" },
  { id: 2, nome: "Touro", caracter: "b", fundo: "fill-red-400" },
  { id: 3, nome: "Gêmeos", caracter: "c", fundo: "fill-blue-400" },
  { id: 4, nome: "Câncer", caracter: "d", fundo: "fill-green-400" },
  { id: 5, nome: "Leão", caracter: "e", fundo: "fill-amber-400" },
  { id: 6, nome: "Virgem", caracter: "f", fundo: "fill-red-400" },
  { id: 7, nome: "Libra", caracter: "g", fundo: "fill-blue-400" },
  { id: 8, nome: "Escorpião", caracter: "h", fundo: "fill-green-400" },
  { id: 9, nome: "Sagitário", caracter: "i", fundo: "fill-amber-400" },
  { id: 10, nome: "Capricórnio", caracter: "j", fundo: "fill-red-400" },
  { id: 11, nome: "Aquário", caracter: "k", fundo: "fill-blue-400" },
  { id: 12, nome: "Peixes", caracter: "l", fundo: "fill-green-400" },
];

interface RodaZodiacoProps {
  className?: string;
  casas: Casa[];
  planetas: Planeta[];
  aspectos: Aspecto[];
}

export default function RodaZodiaco({ casas, planetas, aspectos, className }: RodaZodiacoProps) {
  // Longitude absoluta do Ascendente = cúspide da casa "AC".
  const ascLong = casas.find((c) => c.nome === "AC")?.grau ?? 0;
  // Converte longitude absoluta para o ângulo de desenho (AC no horizonte esquerdo).
  const ang = (L: number): number => L - ascLong;

  return (
    <svg viewBox={`0 0 ${V} ${V}`} className={`h-auto w-full select-none ${className ?? ""}`} role="img" aria-label="Roda zodiacal com os doze signos">
      {/* Signos: giram junto. A fatia-base (Áries) é rotacionada para a posição
          do signo i, já descontando o Ascendente: rotate(ascLong - 30·i). */}
      {signos.map((s, i) => (
        <g key={s.id} transform={`rotate(${ascLong - 30 * i} ${cx} ${cy})`}>
          <path d={FATIA_BASE} className={s.fundo} />

          <text
            x={ICONE_BASE.x}
            y={ICONE_BASE.y}
            transform={`rotate(${ICONE_ROT_BASE} ${ICONE_BASE.x} ${ICONE_BASE.y})`}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-white text-[18px] font-astro"
          >
            {s.caracter}
          </text>

          {[10, 20].map((g) => {
            const linha = getLinhaDecanato(g, 32);
            return <line key={g} x1={linha.p1.x} y1={linha.p1.y} x2={linha.p2.x} y2={linha.p2.y} className="stroke-white" strokeWidth={0.5} />;
          })}
          {[5, 15, 25].map((g) => {
            const linha = getLinhaDecanato(g, 35);
            return <line key={g} x1={linha.p1.x} y1={linha.p1.y} x2={linha.p2.x} y2={linha.p2.y} className="stroke-white/70" strokeWidth={0.5} />;
          })}
        </g>
      ))}

      {/* Círculo central que cobre os miolos das fatias */}
      <circle cx={cx} cy={cy} r={rCentro} className="fill-white" />

      {/* Casas: grau absoluto convertido por ang(). */}
      {casas.map((c) => {
        const l = getLinhaCentral(ang(c.grau));
        return <line key={c.numero} x1={l.p1.x} y1={l.p1.y} x2={l.p2.x} y2={l.p2.y} className="stroke-neutral-300" strokeWidth={c.nome ? 2 : 1} />;
      })}

      {/* Números das casas, no meio de cada casa, junto ao centro */}
      {casas.map((c, i) => {
        const p = pos(37, ang(meioDaCasa(casas, i)));
        return (
          <text key={`num-${c.numero}`} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" className="fill-neutral-500 text-[8px]">
            {c.numero}
          </text>
        );
      })}

      {/* Marcador do Ascendente: ang(ascLong) = 0 → horizonte esquerdo (9 h). */}
      {(() => {
        const linha = getSegmentoRadial(0, rCentro, rExterno);
        const lbl = pos(rExterno + 12, 0);
        return (
          <g>
            <line x1={linha.p1.x} y1={linha.p1.y} x2={linha.p2.x} y2={linha.p2.y} className="stroke-white" strokeWidth={2} strokeDasharray="3,3" />
            <text x={lbl.x} y={lbl.y} textAnchor="middle" dominantBaseline="central" className="fill-white text-[10px] font-bold">
              AC
            </text>
          </g>
        );
      })()}

      {/* Aspectos: graus em longitude absoluta, convertidos por ang(). */}
      {aspectos
        .filter((a) => a.desenhar)
        .map((a, i) => {
          const p1 = pos(rLinhaInternaFim, ang(a.graus[0]));
          const p2 = pos(rLinhaInternaFim, ang(a.graus[1]));
          return <line key={`asp-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={a.cor} strokeWidth={0.8} />;
        })}

      {/* Planetas: posição pela longitude absoluta (via ang); rótulo = grau no signo. */}
      {planetas.map((p) => {
        const a = ang(p.longitude);
        const pt = pos(rPlaneta, a);
        const linhaExt = getSegmentoRadial(a, rLinhaExternaIni, rLinhaExternaFim);
        const linhaInt = getSegmentoRadial(a, rLinhaInternaIni, rLinhaInternaFim);
        return (
          <g key={`pl-${p.id}`}>
            <line x1={linhaExt.p1.x} y1={linhaExt.p1.y} x2={linhaExt.p2.x} y2={linhaExt.p2.y} stroke={p.cor} strokeWidth={1} />
            <text x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="central" fill={p.cor} className="text-[14px] font-astro">
              {p.icone}
            </text>
            <text x={pt.x} y={pt.y + 10} textAnchor="middle" dominantBaseline="central" fill={p.cor} className="text-[5px] font-semibold">
              {p.grau}
            </text>
            <text x={pt.x + 5} y={pt.y + 7} textAnchor="middle" dominantBaseline="central" fill={p.cor} className="text-[3px]">
              {p.minuto}
            </text>
            <line x1={linhaInt.p1.x} y1={linhaInt.p1.y} x2={linhaInt.p2.x} y2={linhaInt.p2.y} stroke={p.cor} strokeWidth={1} />
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r={rExterno} className="fill-none stroke-neutral-300" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={30} className="fill-white stroke-neutral-300" strokeWidth={1} />
    </svg>
  );
}

function pos(raio: number, angulo: number) {
  const a = grausParaRad(angulo);
  const arredonda = (n: number) => Math.round(n * 1000) / 1000;
  return { x: arredonda(cx - raio * Math.cos(a)), y: arredonda(cy + raio * Math.sin(a)) };
}

function getFatia(longitude: number): string {
  const p1 = pos(rExterno, longitude);
  const p2 = pos(rExterno, longitude + 30);
  return `M ${cx} ${cy} L ${p1.x.toFixed(3)} ${p1.y.toFixed(3)} ` + `A ${rExterno} ${rExterno} 0 0 0 ${p2.x.toFixed(3)} ${p2.y.toFixed(3)} Z`;
}

function getLinhaDecanato(grausDentroDoSigno: number, distanciaDaBordaExterna: number) {
  const p1 = pos(rExterno - distanciaDaBordaExterna, grausDentroDoSigno);
  const p2 = { x: cx, y: cy };
  return { p1, p2 };
}

function getLinhaCentral(angulo: number) {
  const p1 = { x: cx, y: cy };
  const p2 = pos(rCentro, angulo);
  return { p1, p2 };
}

function getSegmentoRadial(angulo: number, r1: number, r2: number) {
  return { p1: pos(r1, angulo), p2: pos(r2, angulo) };
}

/** Meio da casa i em longitude ABSOLUTA (resolve o wrap dos 360°). */
function meioDaCasa(casas: Casa[], i: number): number {
  const a1 = casas[i].grau;
  let a2 = casas[(i + 1) % casas.length].grau;
  if (a2 < a1) a2 += 360;
  return ((a1 + a2) / 2) % 360;
}
