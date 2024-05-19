import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserImage } from "@components/UserImage";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Center, Heading, ScrollView, Skeleton, Text, VStack, useToast } from "native-base";
import { useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import { TouchableOpacity } from "react-native";
import * as yup from 'yup';
import UserDefaultPhoto from '../assets/userPhotoDefault.png';


const PHOTO_SIZE = 33;

const profileUpdateSchema = yup.object({
  name:yup.string().required('Informe o nome!'),
  email:yup.string(),
  old_password:yup.string(),
  password:yup.string().min(6,'A senha deve conter 6 dígitos.').nullable().transform((value) => !!value ? value : null),
  confirm_password: yup.string().nullable().transform((value) => !!value ? value : null)
  .oneOf([yup.ref('password')], 'A confirmação da senha não confere!')
  .when('password', {
		is: (Field: any) => Field,
		then: (schema) =>
			schema.nullable().required('Informe a confirmação da senha.').transform((value) => !!value ? value : null),
  }),
})

type FormDataProps = yup.InferType<typeof profileUpdateSchema>

export function Profile(){
  const [isUpdating, setIsUpdating] = useState(false);

  const {user,UpdateUserProfile, SignOut} = useAuth();

  const [isPhotoLoading, setIsPhotoLoading] = useState(false)

  const toast = useToast();

  const {control,handleSubmit, formState:{errors}} = useForm<FormDataProps>({
    defaultValues:{
      name:user.name,
      email:user.email,
    },
    resolver:yupResolver<FormDataProps>(profileUpdateSchema),
  });


  async function handleSelectUserPhoto(){
    setIsPhotoLoading(true)
   try {
    const photoSelected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.Images,
      quality:1,
      aspect:[4,4],
      allowsEditing: true,
      
    });

    console.log(photoSelected)

    if(photoSelected.canceled)return;
    if(photoSelected.assets[0].uri){
     const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);
    
    if(photoInfo.exists && (photoInfo.size /1024 /1024) > 5){
      return toast.show({
        title:"Essa imagem é muito grande!Escolha uma de até 5Mb",
        placement: 'top',
        bgColor: 'red.500',
      })
    }
      const fileExtension =  photoSelected.assets[0].uri.split('.').pop();
      const photoFile = {
        name : `${user.name}.${fileExtension}`.toLowerCase(),
        uri:photoSelected.assets[0].uri,
        type:`${photoSelected.assets[0].type}/${fileExtension}`
      } as any;

      const userPhotoUploadForm = new FormData();
      userPhotoUploadForm.append('avatar', photoFile)

      const avatarUpdatedResponse  = await api.patch('/users/avatar',userPhotoUploadForm, {
        headers:{
          'Content-Type': 'multipart/form-data'
        }
      })

      const userUpdated  = user;
      userUpdated.avatar = avatarUpdatedResponse.data.avatar;
      UpdateUserProfile(userUpdated)

      toast.show({
        title:"Foto Atualizada",
        placement: 'top',
        bgColor: 'green.500',
      })
    }
    
   } catch (error) {
    const isAppError = error instanceof AppError;
    const title = isAppError ? error.message : 'Não foi possível criar , tente novamente mais tarde!'
    toast.show({
      title,
      placement: 'top',
      bgColor: 'red.500',
    })
  }finally{
    setIsPhotoLoading(false)
   }
  }

  async function handleProfileUpdate(data: FormDataProps){
    try {
      setIsUpdating(true)
      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put('/users',data);

      await UpdateUserProfile(userUpdated)
      toast.show({
        title:'Dados atualizados!',
        placement:'top',
        bgColor:'green.500'
      })
      SignOut();
   
    } catch (error) {
    const isAppError = error instanceof AppError;

    const title = isAppError ? error.message : 'Não foi possível atualizar , tente novamente mais tarde !'
    toast.show({
      title,
      placement:'top',
      bgColor:'red.500'
    })
    }finally{
      setIsUpdating(false)
    }
  }

  return(
    <VStack flex={1}>
      <ScreenHeader title="Perfil"/>
      <ScrollView _contentContainerStyle={{paddingBottom:36}} >
        <Center mt={6} px={10}>

          {isPhotoLoading ? 
          <Skeleton w={PHOTO_SIZE} h={PHOTO_SIZE}
          rounded='full'
          startColor="gray.500"
          endColor="gray.300"
          />

          :
          
        <UserImage 
        alt="User profile photo"
        source={user.avatar ? {uri:`${api.defaults.baseURL}/avatar/${user.avatar}`} 
        : UserDefaultPhoto}
        size={PHOTO_SIZE}
        />
        }

        <TouchableOpacity onPress={handleSelectUserPhoto}>
          <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
            Alterar Foto
            </Text>
        </TouchableOpacity>
        
      <Controller control={control} name="name" 
      render={({field: {onChange,value}}) => (
        <Input
        placeholder="name"
        bg="gray.600"
        onChangeText={onChange}
        value={value}
        errorMessage={errors.name?.message}
        />
      )}
   
      />

      <Controller control={control} name="email" 
      render={({field: {onChange,value}}) => (
        <Input
        placeholder="email"
        bg="gray.600"
        onChangeText={onChange}
        value={value}
        isDisabled
        />
      )}
      />
    

        </Center>

        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.100" fontSize="md" mb={2}>
            Alterar Senha 
          </Heading>

        <Controller control={control} name="old_password" 
        render={({field: {onChange,}}) => (
        <Input
        bg="gray.600"
        placeholder="Senha antiga"
        secureTextEntry 
        onChangeText={onChange}
        />
        )}
        />
    
        <Controller control={control} name="password" 
        render={({field: {onChange,}}) => (
        <Input
        bg="gray.600"
        placeholder="Nova senha"
        secureTextEntry
        onChangeText={onChange}
        errorMessage={errors.password?.message}
        />
        )}
        />

        <Controller control={control} name="confirm_password" 
        render={({field: {onChange,}}) => (
        <Input
        bg="gray.600"
        placeholder="Confirme a nova senha"
        secureTextEntry
        onChangeText={onChange}
        errorMessage={errors.confirm_password?.message}
        />
        )}
        />

          <Button
          onPress={handleSubmit(handleProfileUpdate)}
          title="Atualizar"
          mt={4}
          isLoading={isUpdating}
          />
          
        </VStack>
      </ScrollView>
    </VStack>
  )
}