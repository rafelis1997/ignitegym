import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons"
import { useNavigation } from '@react-navigation/native'
import { Heading, HStack, Icon, Text, VStack, Image, Center, Box } from "native-base";

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { Button } from "@components/Button";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionSvg from "@assets/repetitions.svg";

export function Exercise() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  
  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon 
            as={Feather}
            name="arrow-left"
            color="green.500"
            size={6}
          />
        </TouchableOpacity>

        <HStack 
          justifyContent="space-between" 
          mt={4} mb={8} 
          alignItems="center"

        >
          <Heading color="gray.100" fontSize="lg" flexShrink={1}>
            Puxada Frontal
          </Heading>

          <HStack alignItems="center">
            <BodySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">
              Costas
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <VStack p={8}>
        <Center>
          <Image 
            w={["full", "4/5"]}
            h={[80, "lg"]}
            resizeMode="cover"
            source={{ uri: 'http://conteudo.imguol.com.br/c/entretenimento/0c/2019/12/03/remada-unilateral-com-halteres-1575402100538_v2_600x600.jpg' }}
            alt="Nome do exercício"
            mb={3}
            rounded="lg"
            overflow="hidden"
          />

          <Box w={["full", "4/5"]} p={4} bg="gray.600" rounded="md">
            <HStack justifyContent="space-around" mb={[6, 8]} mt={5}>
              <HStack alignItems="center">
                <SeriesSvg />
                <Text color="gray.200" ml={2}>
                  3 séries
                </Text>
              </HStack>

              <HStack alignItems="center">
                <RepetitionSvg />
                <Text color="gray.200" ml={2}>
                  12 repetições
                </Text>
              </HStack>
            </HStack>
           
            <Button title="Marcar como realizado" />
          </Box>
        </Center>
      </VStack>
    </VStack>
  );
}