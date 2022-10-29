import { useState } from "react";
import { useNavigation } from '@react-navigation/native'
import { VStack, HStack, FlatList, Heading, Text } from "native-base";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciseCard } from "@components/ExerciseCard";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

export function Home() {
  const [groups, setGroups] = useState(['costas', 'ombros', 'Tricepes', 'biceps']);
  const [exercises, setExercises] = useState(['1', '2', '3', '4']);
  const [groupSelected, setGroupSelected] = useState('costas');

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExerciseDetails() {
    navigation.navigate('exercise');
  }

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList 
        data={groups}
        keyExtractor={item => item}
        horizontal
        showsHorizontalScrollIndicator={false}

        renderItem={({item}) => (
          <Group 
            name={item} 
            isActive={groupSelected.toUpperCase() === item.toUpperCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}

        _contentContainerStyle={{
          px: 8,
        }}
        my={10}
        maxH={10}
      />

      <VStack flex={1} px={8}>
        <HStack justifyContent="space-between" mb={5}>
          <Heading color="gray.200" fontSize="md">
            Exercícios
          </Heading>

          <Text color="gray.200" fontSize="sm">
            {exercises.length}
          </Text>
        </HStack>

        <FlatList 
          data={exercises}
          keyExtractor={item => item}
          renderItem={({item}) =>  (
            <ExerciseCard 
              exercise={item}
              onPress={handleOpenExerciseDetails}
            />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>    
    </VStack>
  );
}