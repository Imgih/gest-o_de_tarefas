import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Appbar } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import TaskRepository, { Tarefa } from '../../repository/TarefaRepository';

type RootStackParamList = {
  Home: undefined;
  Read: undefined;
  Criar: undefined;
  Editar: { taskTitle?: string };
  Pesquisar: undefined;
  Detalhes: { taskTitle: string };
};

type UpdateTaskProps = StackScreenProps<RootStackParamList, 'Editar'>;

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
      <Appbar.Header style={{ backgroundColor: '#690f67' }}>
        <Appbar.Action icon={() => <AntDesign name="arrowleft" size={24} color="white" />} onPress={() => navigation.goBack()} />
        <Appbar.Content title="Editar Tarefa" titleStyle={{ color: 'white' }} />
      </Appbar.Header>
      <View style={styles.formContainer}>
        <TextInput
          value={task.titulo}
          onChangeText={(text) => setTask({ ...task, titulo: text })}
          placeholder="Título"
          style={styles.input}
        />
        <TextInput
          value={task.materia}
          onChangeText={(text) => setTask({ ...task, materia: text })}
          placeholder="Matéria"
          style={styles.input}
        />
        <TextInput
          value={task.desc}
          onChangeText={(text) => setTask({ ...task, desc: text })}
          placeholder="Descrição"
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
          placeholder="Data de Entrega"
          style={styles.input}
        />
        <TextInput
          value={task.completo}
          onChangeText={(text) => setTask({ ...task, completo: text })}
          placeholder="Status"
          style={styles.input}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  formContainer: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UpdateTask;
