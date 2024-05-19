import { Center, Heading, Image, ScrollView, Text, useToast, VStack } from "native-base";

import BackgroundImg from "@assets/background.png";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { AppError } from "@utils/AppError";
import { Barbell } from "phosphor-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { THEME } from "src/theme";
import * as yup from 'yup';


type FormDataProps = {

  email:string;
  password:string;
 
}



export function SignIn(){
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast();
  const {SignIn} = useAuth();

  const signUpSchema = yup.object({
    email: yup.string().required('Informe o e-mail!').email('E-mail inválido!'),
    password:yup.string().required('Informe a senha!').min(6,'A senha deve conter 6 dígitos.'),
  })

  
  const {control, handleSubmit,formState: { errors }} = useForm<FormDataProps>({
    resolver:yupResolver(signUpSchema),
  });

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleNewAccount(){
    navigation.navigate('signUp')
  }

 async function handleSign({email,password}: FormDataProps){
  try {
    setIsLoading(true)
    await SignIn(email,password)
  }catch (error){
    console.log(error)
    const isAppError = error instanceof AppError;

    const title = isAppError ? error.message : 'Não foi possível entrar , tente novamente mais tarde !'
    toast.show({
      title,
      placement:'top',
      bgColor:'red.500'
    })
    setIsLoading(false)
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
        Acesse sua conta
      </Heading>

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
   

   

      <Button title="Acessar" onPress={handleSubmit(handleSign)} isLoading={isLoading} />
      </Center>

      <Center mt={24}>
      <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
        Ainda não tem acesso?
      </Text>
      </Center>

      <Button onPress={handleNewAccount} title="Criar conta" variant="outline"/>
    </VStack>
    </ScrollView>
  )
}