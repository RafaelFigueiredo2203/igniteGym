import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Box, Heading, HStack, Icon, Image, ScrollView, Text, useToast, VStack } from "native-base";

import { Button } from '@components/Button';
import { RoutesLoading } from '@components/Loading';
import { ExerciseDto } from '@dtos/exercise-dto';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { Barbell, Person, Repeat } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from "react-native";
import { THEME } from '../theme/index';

type RouteParamsProps = {
  exerciseId:string;
}

export function Exercise(){
  const [exercise, setExercise] = useState<ExerciseDto>({} as ExerciseDto)
  const [isLoading,setIsLoading] = useState(false);
  const [submittingRegister,setSubmittingRegister] = useState(false);
  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const route = useRoute();
  const {exerciseId} = route.params as RouteParamsProps;

  function handleGoBack(){
    navigation.goBack();
  }

  async function fetchExerciseDetails(){
    try {
      setIsLoading(true)
      const response = await api.get(`exercises/${exerciseId}`)
      setExercise(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercício!'
      toast.show({
        title,
        placement:'top',
        bgColor:'red.500'
      })
    }finally{
      setIsLoading(false);
    }
  }

  async function handleExerciseRegistryHistory(){
    try {
      setSubmittingRegister(true)

      await api.post('/history', {exercise_id: exerciseId})
      toast.show({
        title:'Parabéns , exercício registrado !',
        placement:'top',
        bgColor:'green.500'
      })
      
      navigation.navigate('history')
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível registrar o exercício!'
      toast.show({
        title,
        placement:'top',
        bgColor:'red.500'
      })
    }finally{
      setSubmittingRegister(false)
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
  },[exerciseId])

  return(
    <VStack flex={1}>
   
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} color="green.500" name='arrow-left' size={6}  />
        </TouchableOpacity>

        <HStack justifyContent="space-between" mt={4} mb={8} alignItems="center">
          <Heading color="gray.100" fontSize="lg" flexShrink={1}>
            {exercise.name}
          </Heading>

          <HStack alignItems="center">
          <Person size={28} color='gray' />
            <Text color="gray.200" ml={1} textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>
      
    <ScrollView>
    
    <VStack p={8}>
    {isLoading ? <RoutesLoading/> :
    <>
    <Box overflow='hidden'  rounded="lg"  mb={3}>
      <Image w="full" h={80} 
      source={{uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`}}
      alt="Nome do exercício"
      resizeMode='cover'
      rounded="lg"
      />
    </Box>
    
      <Box bg="gray.600" rounded='md' pb={4} px={4}>
      <HStack alignItems="center" justifyContent="space-around" mb={6} mt={6}>
        <HStack>
          <Barbell size={26} color={THEME.colors.green[700]}  />
          <Text color="gray.200" ml="2">
            {exercise.series} séries
          </Text>
        </HStack>

        <HStack>
          <Repeat size={26} color={THEME.colors.green[700]} />
          <Text color="gray.200" ml="2">
            {exercise.repetitions} séries
          </Text>
        </HStack>
        </HStack>
        <Button
        onPress={handleExerciseRegistryHistory}
        isLoading={submittingRegister}
        title='Marcar com realizado'
        />
      </Box>
      </>
}
    </VStack>
    
    </ScrollView>
    </VStack>
  )
}