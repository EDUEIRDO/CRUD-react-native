import React, { useEffect, useState } from 'react';
import { ScrollView ,StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { db } from '@/utils/firebase' ;
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import CustomButton from '@/components/customButton';
import { useRouter } from 'expo-router';

interface Dados {
  id: string;
  name: string;
  description: string;
}

export default function ItemPage() {
  const router = useRouter();
  const [dados, setDados] = useState<Dados[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const rota = () => {
    router.push("./teste");
  }
  useEffect(() => {
    const fetchData = async() => {
        try{
            const querySnapShot = await getDocs(collection(db, 'questoes'));
            const items: Dados[] = [];
            querySnapShot.forEach((doc) => {
                items.push({id: doc.id, ...doc.data() } as Dados);
            });
            setDados(items);
        } catch (error) {
            console.error('Error fetching data', error);
        };
    };
    fetchData();
}, []);

const handleAddItem = async () => {
  if (name === '' || description === '') {
    alert('Erro, Por favor preencha os campos');
    return;
  }
  try {
    if (isEditing && editId) {
      const docRef = doc(db, 'questoes', editId);
      await updateDoc(docRef, {
        name,
        description,
      });
      setDados(dados.map(item => item.id === editId ? { id: editId, name, description } : item));
      setIsEditing(false);
      setEditId(null);
    } else {
      const docRef = await addDoc(collection(db, 'questoes'), {
        name,
        description,
      });
      setDados([...dados, { id: docRef.id, name, description }]);
    }
    setName('');
    setDescription('');
    alert('Sucesso, Item adicionado/atualizado com sucesso');
  } catch (error) {
    console.error('Erro ao adicionar/atualizar: ', error);
    alert('Erro, Não foi possível adicionar/atualizar o item');
  }
};

const handleEditItem = (item: Dados) => {
  setName(item.name);
  setDescription(item.description);
  setEditId(item.id);
  setIsEditing(true);
};
  const handleDeleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'questoes', id));
      setDados(dados.filter(item => item.id !== id));
      alert('Sucesso, Item excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir: ', error);
      alert('Erro, Não foi possível excluir o item');
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Perguntas cadastradas</Text>
        {dados.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <TouchableOpacity 
            style={styles.editButton}
            onPress={()=> handleEditItem(item)}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteItem(item.id)}
            >
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        ))}
        <CustomButton title='Adicionar mais' func={rota} />
        <CustomButton title='Continuar' func={rota} />
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 960,
    marginHorizontal: 'auto',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 36,
    color: '#38434D',
  },
  itemContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  itemTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 16,
  },
  editButton: {
    marginTop: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  form: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '100%',
  },
  selectButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  selectButtonText: {
    color: '#fff',
  },
});