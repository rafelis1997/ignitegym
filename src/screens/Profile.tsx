import { Center, ScrollView, Text, VStack, Skeleton, Heading } from "native-base";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { useState } from "react";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState('https://github.com/rafelis1997.png');

  async function handleUserPhotoSelect() {
    const photoSelected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [4,4],
      allowsEditing: true,
    });

    if(photoSelected.cancelled) {
      return;
    }

    setUserPhoto(photoSelected.uri);
  }

  const PHOTO_SIZE = 33;

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Center mt={6} px={10}>
          {
            photoIsLoading ? 
              <Skeleton 
                w={PHOTO_SIZE}
                h={PHOTO_SIZE}
                rounded="full"
                startColor="gray.500"
                endColor="gray.400"
              />
            :
              <UserPhoto 
                source={{ uri: userPhoto}}
                size={PHOTO_SIZE}
                alt="Imagem do usuário"
              />
          }

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text 
              color="green.500" 
              fontSize="md" 
              fontWeight="bold"
              mt={2} 
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Input 
            bg="gray.600"
            placeholder="Nome"
          />
          
          <Input 
            bg="gray.600"
            placeholder="E-mail"
            isDisabled
          />

        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" mb={2}>
            Alterar Senha
          </Heading>

          <Input 
            bg="gray.600"
            placeholder="Senha antiga"
            secureTextEntry
          />

          <Input 
            bg="gray.600"
            placeholder="Nova Senha"
            secureTextEntry
          />

          <Input 
            bg="gray.600"
            placeholder="Confirme a nova senha"
            secureTextEntry
          />

          <Button 
            title="Atualizar informações"
            mt={4}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}