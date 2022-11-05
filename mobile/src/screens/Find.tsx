import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");

  const toast = useToast();

  const { navigate } = useNavigation();

  async function handleJoinPoll() {
    try {
      setIsLoading(true);

      if (!code.trim()) {
        toast.show({
          title: "Informe o código do bolão",
          placement: "top",
          bgColor: "red.500",
        });
      }

      const response = await api.post("polls/join", { code });
      toast.show({
        title: "Você entrou no bolão com sucesso",
        placement: "top",
        bgColor: "green.500",
      });

      setCode("");
      navigate("polls");
    } catch (error) {
      console.log(error);

      let title = "Não foi possível buscar bolão";

      if (error.response?.data?.error === "Poll not found!") {
        title = "Código de bolão não encontrado";
      }

      if (error.response?.data?.error === "You have already joined this poll") {
        title = "Você já está participando desse bolão";
      }
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por Código" showBackButton />
      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão através de seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual código do bolão"
          onChangeText={setCode}
          autoCapitalize="characters"
          value={code}
        />

        <Button
          title="buscar bolão"
          onPress={handleJoinPoll}
          isLoading={isLoading}
        />
      </VStack>
    </VStack>
  );
}
