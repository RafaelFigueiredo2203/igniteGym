import { FormControl, IInputProps, Input as NativeBaseInput } from "native-base";

type Props = IInputProps & {
  errorMessage?:string | null;
}


export function Input({errorMessage = null, isInvalid ,...rest }:Props ){

  const isInvalidInput = !!errorMessage || isInvalid;

  return(
    <FormControl isInvalid={isInvalidInput}>
        
    <FormControl.ErrorMessage>
      {errorMessage}
    </FormControl.ErrorMessage>

    <NativeBaseInput
    bg="gray.700"
    h={14}
    px={4}
    borderWidth={0}
    fontSize='md'
    color='white'
    fontFamily='body'
    mb={4}
    placeholderTextColor='gray.300'
    isInvalid={isInvalidInput}
    _invalid={{
      borderWidth:1,
      borderColor:'red.500'
    }}
    _focus={{
      bg:"gray.700",
      borderWidth:1,
      borderColor:"green.500",
    }}
    {...rest}
    />
  
    </FormControl>

  )
}