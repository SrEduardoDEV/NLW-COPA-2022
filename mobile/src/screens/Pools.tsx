import { VStack, Icon, useToast, FlatList } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Octicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { api } from "../services/api";
import { useCallback, useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { PollCard, PollCardProps } from "../components/PollCard";
import { EmptyPoolList } from "../components/EmptyPoolList";

export function Pools() {
  const { navigate } = useNavigation();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [polls, setPolls] = useState<PollCardProps[]>([]);

  async function fetchPolls() {
    try {
      setIsLoading(true);
      const response = await api.get("/polls");
      setPolls(response.data.polls);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível carregar os bolões",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPolls();
    }, [])
  );

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus Bolões" />
      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          title="buscar bolão por código"
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md" />
          }
          onPress={() => navigate("find")}
        />
      </VStack>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={polls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PollCard
              data={item}
              onPress={() => navigate("details", { id: item.id })}
            />
          )}
          ListEmptyComponent={() => <EmptyPoolList />}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
        />
      )}
    </VStack>
  );
}
