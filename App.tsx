import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/Homescreen/homescreen';
import Dashboard from './src/screens/Ler/Read';
import Criar from './src/screens/Criar/Criar';
import UpdateTask from './src/screens/Editar/Editar';
import SearchScreen from './src/screens/Editar/pesquisar';
import TaskDetailsScreen from './src/screens/Ler/detalhes';

type RootStackParamList = {
  Home: undefined;
  Read: undefined;
  Criar: undefined;
  Editar: { taskId?: number; taskTitle?: string };
  Pesquisar: undefined;
  Detalhes: { taskId: number };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Read" component={Dashboard} />
        <Stack.Screen name="Criar" component={Criar} />
      
        <Stack.Screen name="Pesquisar" component={SearchScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
