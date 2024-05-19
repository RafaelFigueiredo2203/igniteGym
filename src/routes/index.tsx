
import { RoutesLoading } from "@components/Loading";
import { useAuth } from "@hooks/useAuth";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { Box, useTheme } from "native-base";
import { AppRoutes } from "./app.routes";
import { AuthRouter } from "./auth.routes";


export function Routes(){

  const {user, isLoadingUserStorageData} = useAuth();

  const {colors} = useTheme();
  const theme = DefaultTheme;
  theme.colors.background=colors.gray[700]

  if(isLoadingUserStorageData){
    return <RoutesLoading/>
  }

  return (
    <Box flex={1} bg='gray.700'>
    <NavigationContainer theme={theme} independent={true}>

      {user.id ? <AppRoutes/> : <AuthRouter/>}
   
    </NavigationContainer>
    </Box>
  )
}