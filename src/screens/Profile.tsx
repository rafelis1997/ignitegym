import { useState } from "react";
import { Center, ScrollView, Text, VStack, Skeleton, Heading, useToast } from "native-base";
import { TouchableOpacity } from "react-native";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { api } from "@services/api";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

import defaultUserAvatar from '@assets/userPhotoDefault.png'

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
  old_password: string;
}

const profileSchema = yup.object({
  name: yup
    .string()
    .required('Informe o nome.'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos')
    .nullable()
    .transform((value) => !!value ? value : null ),
  password_confirm: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null )
    .oneOf([yup.ref('password'), null], 'A confirmação de senha não confere.')
    .when('password', {
      is: (Field: any) => Field,
      then: yup
              .string()
              .nullable()
              .required('Informe a confirmação da senha.')
              .transform((value) => !!value ? value : null )
    })
})

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState();

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();
  const { control, handleSubmit, formState: {errors} } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
      password: undefined,
      password_confirm: undefined,
    }, resolver: yupResolver(profileSchema),
  });

  async function handleUserPhotoSelect() {
    try {
      setPhotoIsLoading(true);
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4,4],
        allowsEditing: true,
      });
  
      if(photoSelected.canceled) {
        return;
      }

      if(photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);
        
        if(photoInfo.size && (photoInfo.size / 1024 / 1024) > 5) {
          return toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB.',
            placement: 'top',
            bgColor: 'red.500',
          });
        }
        
        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `${user.name.trim()}.${fileExtension}`.toLocaleLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append('avatar', photoFile);

        const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        const userUpdated = user;
        userUpdated.avatar = avatarUpdatedResponse.data.avatar;
        await updateUserProfile(userUpdated);

        toast.show({
          title: 'Foto Atualizada',
          placement: 'top',
          bgColor: 'green.500',
        });
      }
  
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true);

      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put('/users', data);

      await updateUserProfile(userUpdated);

      toast.show({
        title: 'Perfil atualizado com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      })

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível atualizar as informações. tente novamente mais tarde'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsUpdating(false);
    }
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
                source={
                  user.avatar 
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } 
                  : defaultUserAvatar}
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

          <Controller
            name="name"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                onChangeText={onChange}
                value={value} 
                bg="gray.600"
                placeholder="Nome"
                errorMessage={errors.name?.message}
              />

            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                onChangeText={onChange}
                value={value} 
                bg="gray.600"
                placeholder="E-mail"
                isDisabled
              />

            )}
          />
        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" mb={2} fontFamily="heading">
            Alterar Senha
          </Heading>

          <Controller
            name="old_password"
            control={control}
            render={({ field: { onChange } }) => (
              <Input 
                bg="gray.600"
                placeholder="Senha antiga"
                onChangeText={onChange}
                secureTextEntry
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field: { onChange } }) => (
              <Input 
                bg="gray.600"
                placeholder="Nova Senha"
                onChangeText={onChange}
                secureTextEntry
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            name="password_confirm"
            control={control}
            render={({ field: { onChange } }) => (
              <Input 
                bg="gray.600"
                placeholder="Confirme a nova senha"
                onChangeText={onChange}
                secureTextEntry
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />

          <Button 
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdating}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}