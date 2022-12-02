import { useState } from 'react';
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base';
import  { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';

import { api } from '@services/api';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

import LogoSvg from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  email: yup.string().required('Informe o email').email('Informe um email válido'),
  password: yup.string().required('Informe a senha').min(6, 'Mínimo de 6 caracteres'),
  password_confirm: yup.string().required('Confirme a senha')
    .oneOf([yup.ref('password'), null], 'A confirmação não é igual a senha digitada')
});

export function SignUp() {
  const [ isLoading, setIsLoading ] = useState(false)

  const { control, handleSubmit, formState: { isSubmitting, errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  });

  const toast = useToast();
  const { signIn } = useAuth();

  const navigation  = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleSignUp({ name, email, password }: FormDataProps) {
    try {
      setIsLoading(true);

      const lowerCaseEmail = email.toLowerCase();

      await api.post('/users', { name, email: lowerCaseEmail, password })
      await signIn(lowerCaseEmail, String(password));

    } catch (error) {
      setIsLoading(false);

      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1}} showsVerticalScrollIndicator={false}>
      <VStack flex={1} px={10} pb={16}>
        <Image 
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="pessoas malhando"
          resizeMode='contain'
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>


        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Crie sua conta
          </Heading>

          <Controller 
            control={control}
            name="name"
            render={({field: { onChange, value }}) => (
              <Input 
                placeholder='Nome' 
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller 
            control={control}
            name="email"
            render={({field: { onChange, value }}) => (
              <Input 
                placeholder='Email' 
                keyboardType='email-address'
                autoCapitalize='none'
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller 
            control={control}
            name="password"
            render={({field: { onChange, value }}) => (
              <Input 
                placeholder='Senha' 
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />
          
          <Controller 
            control={control}
            name="password_confirm"
            render={({field: { onChange, value }}) => (
              <Input 
                placeholder='Confirme a senha' 
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType='send'
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />
          

          <Button 
            title='Criar e acessar'
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>

        <Button 
          mt={12}

          title='Voltar para o login' 
          variant="outline"
          onPress={handleGoBack}
        />

      </VStack>
    </ScrollView>
  );
}