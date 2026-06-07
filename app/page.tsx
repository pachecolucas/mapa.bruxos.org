import Home from "./home";
import { getCeu } from "./model";
import { cadastro_agora, cadastro_list } from "./model/cadastro";

export default async function Page() {
  const cadastro = await cadastro_agora();
  const cadastros = await cadastro_list();

  const ceu = await getCeu(cadastro);

  return (
    <div>
      <Home ceu={ceu} cadastros={cadastros} cadastro={cadastro} />
    </div>
  );
}
