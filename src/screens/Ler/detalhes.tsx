import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import TaskRepository, { Tarefa } from '../../repository/TarefaRepository';

type RootStackParamList = {
  Home: undefined;
  Read: undefined;
  Criar: undefined;
  Editar: { taskTitle?: string };
  Pesquisar: undefined;
  Detalhes: { taskTitle: string };
};

type TaskDetailsScreenRouteProp = RouteProp<RootStackParamList, 'Detalhes'>;

type TaskDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Detalhes'>;

type Props = {
  route: TaskDetailsScreenRouteProp;
  navigation: TaskDetailsScreenNavigationProp;
};

const TaskDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskTitle } = route.params;
  const [taskDetails, setTaskDetails] = useState<Tarefa | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const taskRepo = new TaskRepository();
        const task = await taskRepo.getTaskByTitle(taskTitle);
        setTaskDetails(task);
      } catch (error) {
        console.error('Erro ao buscar detalhes da tarefa:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskTitle]);

  const handleEditTask = () => {
    navigation.navigate('Editar', { taskTitle });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {taskDetails ? (
        <View>
          <Text style={styles.title}>Título: {taskDetails.titulo}</Text>
          <Text style={styles.text}>Descrição: {taskDetails.descricao}</Text>
          <Text style={styles.text}>Matéria: {taskDetails.materia}</Text>
          <Text style={styles.text}>Professor: {taskDetails.professor}</Text>
          <Text style={styles.text}>Data: {taskDetails.data}</Text>
          <Text style={styles.text}>Status: {taskDetails.completo}</Text>
          <Button title="Editar" onPress={handleEditTask} />
        </View>
      ) : (
        <Text>Nenhuma tarefa encontrada com o título {taskTitle}</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default TaskDetailsScreen;
