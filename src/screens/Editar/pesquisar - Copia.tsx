import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import TaskRepository, {Tarefa} from '../../repository/TarefaRepository';// Certifique-se de importar corretamente o arquivo do repositório

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
  const [isSearching, setIsSearching] = useState<boolean>(false); // Estado para controlar o estado de busca

  const handleSearch = async () => {
    try {
      setIsSearching(true); // Indica que a busca está em andamento
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
      setIsSearching(false); // Finaliza a busca
    }
  };

  const renderItem = ({ item }: { item: Tarefa }) => (
    <View style={styles.resultItem}>
      <Text style={styles.resultItemText}>{item.titulo}</Text>
      <Text>{item.desc}</Text>
      {/* Outros detalhes da tarefa podem ser mostrados aqui */}
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite o título da tarefa"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />
      <Button title="Buscar" onPress={handleSearch} disabled={isSearching} />

      {isSearching && <Text>Buscando...</Text>}

      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        ListEmptyComponent={<Text>Nenhum resultado encontrado</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  resultItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  resultItemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SearchScreen;
