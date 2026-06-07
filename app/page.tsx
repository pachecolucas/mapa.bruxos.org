import Home from "./home";
import { getCeu } from "./model";
import { Cadastro, cadastro_list } from "./model/cadastro";

export default async function Page() {
  const cadastros: Cadastro[] = await cadastro_list();
  const cadastro = cadastros[2];
  // dados.utcOffset = await getUtc(dados);

  const ceu = await getCeu(cadastro);

  return (
    <div>
      <Home ceu={ceu} cadastro={cadastro} cadastros={cadastros} />
    </div>
  );
}
