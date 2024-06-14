import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, StatusBar } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Appbar } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import TaskRepository, { Tarefa } from '../../repository/TarefaRepository';

type RootStackParamList = {
  Home: undefined;
  Read: undefined;
  Criar: undefined;
  Editar: { taskTitle?: string };
  Pesquisar: undefined;
  Detalhes: { taskTitle?: string };
};

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Pesquisar'>;

type Props = {
  navigation: SearchScreenNavigationProp;
};

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Tarefa[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      const taskRepo = new TaskRepository();
      const foundTask = await taskRepo.getTaskByTitle(taskTitle);

      if (foundTask) {
        setSearchResults([foundTask]);
      } else {
        setSearchResults([]);
        Alert.alert('Nenhuma tarefa encontrada', `Não foi encontrada nenhuma tarefa com o título "${taskTitle}".`);
      }
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      Alert.alert('Erro', 'Erro ao buscar tarefa. Por favor, tente novamente.');
    } finally {
      setIsSearching(false);
    }
  };

  const renderItem = ({ item }: { item: Tarefa }) => (
    <View style={styles.resultItem}>
      <Text style={styles.resultItemText}>{item.titulo}</Text>
      <Text>{item.desc}</Text>
      <Text>{item.materia}</Text>
      <Text>{item.prof}</Text>
      <Text>{item.data}</Text>
      <Text>{item.completo}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#690f67" />
      <Appbar.Header style={{ backgroundColor: '#690f67' }}>
        <Appbar.Content title="To Do - Tarefas" titleStyle={{ color: 'white' }} />
        <Appbar.Action icon={() => <AntDesign name="home" size={24} color="white" />} onPress={() => navigation.navigate('Home')} />
      </Appbar.Header>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar tarefa..."
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
        <View style={styles.buttonContainer}>
          <Button title="Buscar" onPress={handleSearch} disabled={isSearching} color="#690f67" />
        </View>
      </View>
      {isSearching && <Text style={styles.loadingText}>Buscando...</Text>}
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.titulo}
        ListEmptyComponent={!isSearching ? <Text style={styles.emptyText}>Nenhum resultado encontrado</Text> : null}
      />
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
  buttonContainer: {
    marginTop: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  resultItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 16,
    marginVertical: 5,
  },
  resultItemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default SearchScreen;
