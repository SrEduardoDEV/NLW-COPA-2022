import { useEffect, useState } from "react";
import { FlatList, useToast } from "native-base";
import { api } from "../services/api";
import { Game, GameProps } from "./Game";
import { Loading } from "./Loading";
import { EmptyMyPoolList } from "./EmptyMyPoolList";

interface Props {
  pollId: string;
  pollCode: string;
}

export function Guesses({ pollId, pollCode }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");

  const toast = useToast();

  async function fetchGames() {
    try {
      setIsLoading(true);
      const response = await api.get(`/polls/${pollId}/games`);
      setGames(response.data.games);
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível carregar os jogos",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      setIsLoading(true);

      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        toast.show({
          title: "Informe o placar do palpite",
          placement: "top",
          bgColor: "red.500",
        });
      } else {
        const response = await api.post(
          `/polls/${pollId}/games/${gameId}/guesses`,
          {
            firstTeamPoints: Number(firstTeamPoints),
            secondTeamPoints: Number(secondTeamPoints),
          }
        );
        toast.show({
          title: "Palpite enviado com sucesso",
          placement: "top",
          bgColor: "green.500",
        });

        fetchGames();
      }
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possivel confirmar o palpite",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, [pollId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      ListEmptyComponent={() => <EmptyMyPoolList code={pollCode} />}
    />
  );
}
