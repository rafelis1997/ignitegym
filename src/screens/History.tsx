import { useCallback, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { Heading, VStack, SectionList, Text, useToast, Center } from "native-base";

import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { useAuth } from '@hooks/useAuth';

import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO';
import { Loading } from '@components/Loading';

export function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

  const toast = useToast();
  const { refreshedToken } = useAuth();

  async function fetchHistory() {
    try {
      setIsLoading(true);

      const { data } = await api.get('/history');
      setExercises(data);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar o histórico, tente mais tarde'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchHistory();
  }, [refreshedToken]))

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de exercícios"/>
      {
        isLoading ? <Loading /> : (
          exercises?.length > 0 ? (
            <SectionList 
              sections={exercises}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <HistoryCard data={item}/>}
              renderSectionHeader={({ section }) => (
                <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
                  {section.title}
                </Heading>
              )}
              px={8}
              contentContainerStyle={exercises.length === 0 ? 
                { flex: 1, justifyContent: 'center'} 
                : 
                { paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />
          )
          :
            <Center flex={1}>
              <Text color="gray.100" textAlign="center">
                Não há exercícios registrados ainda. {'\n'}
                Vamos nos exercitar hoje?
              </Text>
            </Center>
        )
      }

    </VStack>
  );
}