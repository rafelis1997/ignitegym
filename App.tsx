import { StatusBar, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { NativeBaseProvider } from 'native-base'
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { THEME } from './src/theme';
import { Loading } from '@components/Loading';
import { Routes } from './src/routes';
import { AuthContextProvider } from '@contexts/AuthContext';


export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  if (Platform.OS === 'android') {
    NavigationBar.setBackgroundColorAsync("#202024");
  }

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar 
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />

      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
