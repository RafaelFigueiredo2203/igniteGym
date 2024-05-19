import { Center, Spinner } from "native-base";
import { Barbell } from "phosphor-react-native";
import { THEME } from "src/theme";

export function RoutesLoading(){
  return(
  <Center flex={1} bg={"gray.700"}>
      <Barbell size={52} color={THEME.colors.green[700]}/>
     <Spinner size={30} color={"green.500"}/>
  </Center>
  )
}