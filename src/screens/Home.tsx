import ExerciseCard from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { RoutesLoading } from "@components/Loading";
import { ExerciseDto } from "@dtos/exercise-dto";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { FlatList, Heading, HStack, Text, useToast, VStack } from "native-base";
import { useCallback, useEffect, useState } from "react";

export function Home(){
  const toast = useToast();
  const [groups, setGroups] = useState<string[]>([])
  const [isGroupSelected, setIsGroupSelected] = useState('antebraço');
  const [exercises, setExercises] = useState<ExerciseDto[]>([]) 
  const [isLoading,setIsLoading] = useState(true);

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExercise(exerciseId:string){
    navigation.navigate('exercise',{exerciseId})
  }

  async function fetchGroups(){
    try {
     
      const response = await api.get('/groups');
      setGroups(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares!'
      toast.show({
        title,
        placement:'top',
        bgColor:'red.500'
      })
    }
  }

  async function fetchExercisesByGroup(){
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/bygroup/${isGroupSelected}`)
      setExercises(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os exercícios!'
      toast.show({
        title,
        placement:'top',
        bgColor:'red.500'
      })
    }finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  },[])

  useFocusEffect(useCallback(() => {
    fetchExercisesByGroup();
  },[isGroupSelected]))

  return(
    <VStack flex={1}>
      <HomeHeader/>


      <FlatList 
      data={groups}
      keyExtractor={item => item}
      renderItem={({item}) => (
        <Group 
        name={item} isActive={String(isGroupSelected).toLocaleUpperCase() === String(item).toLocaleUpperCase()}
        onPress={() => setIsGroupSelected(item)}
        />
  )}
      horizontal
      showsHorizontalScrollIndicator={false}
      _contentContainerStyle={{px:8}}
      my={10}
      maxH={10}
      minH={10}
      />

    { isLoading ? <RoutesLoading/> : 
      <VStack flex={1} px={8}>
      <HStack justifyContent="space-between" mb={5}>
        <Heading color="gray.200" fontSize="md">
          Exercícios
        </Heading>

        <Text
        color="gray.200" fontSize="sm"
        >{exercises.length}
        </Text>
      </HStack>

      
      <FlatList
      data={exercises}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
      <ExerciseCard  
      data={item}
      onPress={() => handleOpenExercise(item.id)}
      />
    )}
      showsVerticalScrollIndicator={false}
      _contentContainerStyle={{paddingBottom:20}}
      />
      </VStack>
    }
    </VStack>
  )
}