import BackgroundImg from "@assets/background.png";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from "@hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { Center, Heading, Image, ScrollView, Text, useToast, VStack } from "native-base";
import { Barbell } from "phosphor-react-native";
import { useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import { THEME } from "src/theme";
import * as yup from 'yup';


type FormDataProps = {
  name:string;
  email:string;
  password:string;
  password_confirm:string
}

const signUpSchema = yup.object({
  name:yup.string().required('Informe o nome!'),
  email: yup.string().required('Informe o e-mail!').email('E-mail inválido!'),
  password:yup.string().required('Informe a senha!').min(6,'A senha deve conter 6 dígitos.'),
  password_confirm: yup.string().required('Confirme a senha!').oneOf([yup.ref('password')], 'A confirmação da senha não confere!')
})

export function SignUp(){
  const [isLoading, setIsLoading] = useState(false);
  const {SignIn} = useAuth();
  const toast = useToast();

  const {control, handleSubmit,formState: { errors }} = useForm<FormDataProps>({
    resolver:yupResolver(signUpSchema),
  });

  const navigation = useNavigation();

  function handleBackToLogin(){
    navigation.goBack()
  }

  async function handleSignUp({name, email, password}:FormDataProps){

    try {
      setIsLoading(true)
      await api.post('/users',{
        name, email, password
      })
      await SignIn(email, password);
    } catch (error) {
      setIsLoading(false)
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível criar , tente novamente mais tarde!'
      toast.show({
        title:title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }
  

  return(
    <ScrollView contentContainerStyle={{flexGrow:1}} showsVerticalScrollIndicator={false}>
   
     <Image
      defaultSource={BackgroundImg}
      source={BackgroundImg}
      alt="Pessoas treinando"
      resizeMode="cover"
      position="absolute"
      />


    <VStack flex={1}  px={10} pb={16} >
     
      <Center my={24}>

   
      <Barbell size={42} color={THEME.colors.green[700]}  />

      <Text color='gray.100' fontSize='sm'>
      Treine sua mente e o seu corpo
      </Text>
      </Center>

      <Center> 
      <Heading color='gray.100' fontSize='xl' mb={6} fontFamily="heading">
        Crie sua conta
      </Heading>

     
      <Controller control={control} name="name" 
      render={({field: {onChange,value}}) => (
        <Input placeholder="Nome"
        onChangeText={onChange}
        value={value}
        errorMessage={errors.name?.message}
        />
      )}
   
      />
    

      <Controller control={control} name="email" 
      render={({field: {onChange,value}}) => (
      <Input placeholder="E-mail"
      keyboardType="email-address"
      autoCapitalize="none"
      onChangeText={onChange}
      value={value}
      errorMessage={errors.email?.message}
      />
      )}
      
      />
     

      <Controller control={control} name="password" 
      render={({field: {onChange,value}}) => (
        <Input placeholder="Senha"
        secureTextEntry
        onChangeText={onChange}
        value={value}
        errorMessage={errors.password?.message}
        />
      )}/>
   

      <Controller control={control} name="password_confirm" 
      render={({field: {onChange,value}}) => (
        <Input placeholder="Confirme a Senha"
        secureTextEntry
        onChangeText={onChange}
        value={value}
        onSubmitEditing={handleSubmit(handleSignUp)}
        returnKeyType="send"
        errorMessage={errors.password_confirm?.message}
        />
      )}/>
    


      <Button title="Criar e acessar"
      isLoading={isLoading}
      onPress={handleSubmit(handleSignUp)}
      />
      
      </Center>

     

      <Button onPress={handleBackToLogin} title="Voltar para o login" variant="outline" mt={24}/>
    </VStack>
    </ScrollView>
  )
}