import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, TextInput, Alert } from 'react-native';
import { Button, Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import TaskRepository, { Tarefa } from '../../repository/TarefaRepository';

type RootStackParamList = {
  homescreen: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'homescreen'>;

const Criar: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const taskRepository = new TaskRepository(); // Instância do TaskRepository

  const [titulo, setTitulo] = useState<string>("");
  const [materia, setMateria] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [prof, setProf] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [completo, setCompleto] = useState<string>("0"); // Defina como "0" para não concluído

  const handleSave = async () => {
    if (!titulo || !materia || !desc) {
      Alert.alert("Erro", "Todos os campos são obrigatórios!");
      return;
    }

    const newTask: Tarefa = {
      titulo: titulo,
      desc: desc,
      materia: materia,
      prof: prof,
      data: data,
      completo: completo,
    };

    try {
      await taskRepository.create(newTask);
      Alert.alert("Sucesso", "Tarefa adicionada com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      Alert.alert("Erro", "Ocorreu um erro ao salvar a tarefa.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#690f67" />
      <Appbar.Header style={{ backgroundColor: '#690f67' }}>
        <Appbar.Content title="Editar Tarefa" titleStyle={{ color: 'white' }} />
        <Appbar.Action
          icon="arrow-left"
          color="white"
          onPress={() => navigation.goBack()}
        />
      </Appbar.Header>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={styles.input}
          placeholder="Matéria"
          value={materia}
          onChangeText={setMateria}
        />
        <TextInput
          style={[styles.input, styles.descInput]}
          placeholder="Descrição"
          multiline
          numberOfLines={4}
          value={desc}
          onChangeText={setDesc}
        />
        <TextInput
          style={styles.input}
          placeholder="Professor"
          value={prof}
          onChangeText={setProf}
        />
        <TextInput
          style={styles.input}
          placeholder="Data de Entrega"
          value={data}
          onChangeText={setData}
        />
        <TextInput
          style={styles.input}
          placeholder="Status"
          value={completo}
          onChangeText={setCompleto}
        />
        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: colors.primary }]}
          labelStyle={styles.buttonLabel}
          onPress={handleSave}
        >
          Salvar
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    flex: 1,
    padding: 20,
    marginTop: StatusBar.currentHeight || 0,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  descInput: {
    height: 100,
  },
  button: {
    marginTop: 20,
  },
  buttonLabel: {
    fontSize: 16,
    color: 'white',
  },
});

export default Criar;
