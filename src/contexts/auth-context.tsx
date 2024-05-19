import { UserDto } from "@dtos/user-dto";
import { api } from "@services/api";
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "@storage/storageTokenUser";
import { storageUserGet, storageUserSave, storageUserSignOut } from "@storage/storageUser";
import { createContext, ReactNode, useEffect, useState } from "react";

export type AuthContextDataProps = {
  user: UserDto;
  SignIn: (email: string, password:string) => Promise<void>;
  isLoadingUserStorageData: boolean;
  SignOut: () => Promise<void>;
  UpdateUserProfile:(userUpdated: UserDto) => void;
}


type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);


export function AuthContextProvider({children}: AuthContextProviderProps){  

  const [user,setUser] = useState<UserDto>({} as UserDto);
  const [isLoadingUserStorageData,setIsLoadingUserStorageData] = useState(true);

  async function userAndTokenUpdate(userData: UserDto, token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
    setUser(userData);
  }

  async function storageUserAndTokenSave(userData: UserDto, token: string, refresh_token: string) {
    try {
      setIsLoadingUserStorageData(true)
      await storageUserSave(userData);
      await storageAuthTokenSave({ token, refresh_token });
      
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function SignIn(email:string , password:string){
    try {
      const { data } = await api.post('/sessions', { email, password });
     
      if(data.user && data.token && data.refresh_token) {
        await storageUserAndTokenSave(data.user, data.token, data.refresh_token);
        userAndTokenUpdate(data.user, data.token)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function SignOut(){
    try {
      setIsLoadingUserStorageData(true)
      setUser({} as UserDto)
      await storageUserSignOut();
      await storageAuthTokenRemove();
    } catch (error) {
      throw error;
    }finally{
      setIsLoadingUserStorageData(false)
    }
  }

  async function UpdateUserProfile(userUpdated: UserDto){
    try {
      setUser(userUpdated);
      await storageUserSave(userUpdated)
    } catch (error) {
      throw error
    }
  }

  async function LoadUserData(){
    try {
      setIsLoadingUserStorageData(true)
      const userLogged = await storageUserGet();
      const {token} = await storageAuthTokenGet();

      if(token && userLogged){
        userAndTokenUpdate(userLogged, token);
      }
    } catch (error) {
        throw error;
    }finally{
      setIsLoadingUserStorageData(false)
    }
  }

  useEffect(() => {
    LoadUserData();
  },[]);

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(SignOut);

    return () => {
      subscribe();
    }
  },[SignOut])

 return(
  <AuthContext.Provider value={{user, SignIn, isLoadingUserStorageData,SignOut,UpdateUserProfile}}>
    {children}
  </AuthContext.Provider> 
 )
}