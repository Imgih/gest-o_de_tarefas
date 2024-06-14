// UpdateTask.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import TaskRepository, { Tarefa } from '../../repository/TarefaRepository';

type RootStackParamList = {
  Dashboard: undefined;
  TaskDetails: undefined;
  UpdateTask: { taskTitle?: string };
  Criar: undefined;
  SearchScreen: undefined;
};

type UpdateTaskProps = StackScreenProps<RootStackParamList, 'UpdateTask'>;

const UpdateTask: React.FC<UpdateTaskProps> = ({ route, navigation }) => {
  const { taskTitle } = route.params;
  const [task, setTask] = useState<Tarefa | null>(null);

  useEffect(() => {
    const fetchTaskByTitle = async () => {
      if (taskTitle) {
        const taskRepo = new TaskRepository();
        const fetchedTask = await taskRepo.getTaskByTitle(taskTitle);
        setTask(fetchedTask);
      }
    };

    fetchTaskByTitle();
  }, [taskTitle]);

  const handleUpdate = async () => {
    if (!task) {
      Alert.alert('Erro', 'Tarefa não encontrada para edição.');
      return;
    }

    const taskRepo = new TaskRepository();
    try {
      await taskRepo.updateTask(task);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      Alert.alert('Erro', 'Erro ao atualizar tarefa. Por favor, tente novamente.');
    }
  };

  if (!task) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Edit Task</Text>
      <TextInput
        value={task.titulo}
        onChangeText={(text) => setTask({ ...task, titulo: text })}
        placeholder="Título"
        style={styles.input}
      />
      <TextInput
        value={task.desc}
        onChangeText={(text) => setTask({ ...task, desc: text })}
        placeholder="Descrição"
        style={styles.input}
      />
      <TextInput
        value={task.materia}
        onChangeText={(text) => setTask({ ...task, materia: text })}
        placeholder="Matéria"
        style={styles.input}
      />
      <TextInput
        value={task.prof}
        onChangeText={(text) => setTask({ ...task, prof: text })}
        placeholder="Professor"
        style={styles.input}
      />
      <TextInput
        value={task.data}
        onChangeText={(text) => setTask({ ...task, data: text })}
        placeholder="Data"
        style={styles.input}
      />
      <TextInput
        value={task.completo}
        onChangeText={(text) => setTask({ ...task, completo: text })}
        placeholder="Completo"
        style={styles.input}
      />
      <Button title="Salvar Tarefa" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 10,
  },
});

export default UpdateTask;
