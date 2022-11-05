import { FormEvent, useState } from "react";
import Image from "next/image";
import appPreviewImg from "../assets/app-nlw-preview.png";
import logoImg from "../assets/logo.svg";
import usersAvataresImg from "../assets/users-avatares.png";
import iconCheckImg from "../assets/icon-check.svg";
import { api } from "../lib/axios";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}
export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");
  async function createPool(event: FormEvent) {
    event.preventDefault();
    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });
      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert(
        "Bolão criado com sucesso. O codigo foi copiado para area de transferencia"
      );
      setPoolTitle("");
    } catch (e) {
      console.log(e);
      alert("Falha ao criar o bolão");
    }
  }

  return (
    <div className="max-w-5xl h-screen mx-auto grid grid-cols-2 gap-12 items-center">
      <main>
        <Image src={logoImg} alt="" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        <div className="mt-10 flex items-center gap-2 ">
          <Image src={usersAvataresImg} alt="" />
          <strong className="text-gray-100 font-bold text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>
        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button className="bg-yellow-500 rounded px-6 py-4 font-bold text-sm text-gray-900 uppercase hover:bg-yellow-700">
            Criar meu bolão
          </button>
        </form>
        <p className="mt-4 leading-relaxed text-gray-300 text-sm">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>
        <div className="mt-10 pt-10 border-t border-x-gray-800 divide-x grid grid-cols-2 text-gray-100 leading-snug">
          <div className="flex items-center">
            <Image src={iconCheckImg} alt="" />
            <div className="ml-6">
              <span className="block font-bold text-2xl">
                +{props.poolCount}
              </span>
              <span className="text-base">Bolões criados</span>
            </div>
          </div>
          <div className="flex flex-row-reverse items-center">
            <div className="ml-6">
              <span className="block font-bold text-2xl">
                +{props.guessCount}
              </span>
              <span className="text-base">Palpites enviados</span>
            </div>
            <Image src={iconCheckImg} alt="" />
          </div>
        </div>
      </main>
      <Image src={appPreviewImg} alt="" quality={100} />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("/polls/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
};
