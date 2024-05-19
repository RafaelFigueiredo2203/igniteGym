import { MaterialIcons } from '@expo/vector-icons'
import { useAuth } from '@hooks/useAuth'
import { api } from '@services/api'
import { Heading, HStack, Icon, Text, VStack } from 'native-base'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import UserDefaultPhoto from '../assets/userPhotoDefault.png'
import { UserImage } from './UserImage'

export function HomeHeader() {

  const {user,SignOut} = useAuth();


  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
    <UserImage
    alt="User profile photo"
    source={user.avatar ? {uri:`${api.defaults.baseURL}/avatar/${user.avatar}`} 
    : UserDefaultPhoto}
    size={16}
    mr={4}
    />

    <VStack flex={1}>
      <Text color="gray.100" fontSize="md">
        Olá
      </Text>
   
    <Heading color="gray.100" fontSize="md">
      {user.name}
    </Heading>
    </VStack>

    <TouchableOpacity onPress={SignOut}>
    <Icon
    as={MaterialIcons}
    name="logout" 
    color="gray.200"
    size={7}
    />
    </TouchableOpacity>
    
    </HStack>
  )
}