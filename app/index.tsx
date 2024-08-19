import React, { useEffect, useState } from 'react';
import { Alert ,StyleSheet, Text, View, TextInput } from 'react-native';
import { db } from '@/utils/firebase' ;
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/customButton';

interface Dados{
    id: string;
    name: string;
    description: string;

}

export default function CadastroItem() {
    const router = useRouter();
    const [dados, setDados] = useState<Dados[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

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
        if (name ==='' || description ===''){
            Alert.alert('Erro', 'Por favor preencha os campos');
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
            }else {
                const docRef = await addDoc(collection(db, 'questoes'), {
                    name,
                    description,
                });
                setDados([...dados, { id: docRef.id, name, description }]);
            }
        setName('');
        setDescription('');
        Alert.alert('Sucesso', 'Item adicionado/atualizado com sucesso');
        router.push('/');
        }catch (error) {
            console.error('Erro ao adicionar/atualizar:', error);
        }
    };
    return(
      <View style={styles.container} >
      <Text style={styles.title}>Cadastro de quest</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Nome do item*</Text>
        <TextInput style={styles.input} placeholder="Texto" value={name} onChangeText={setName} />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Descrição*</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descrição"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}/>
      </View>
      <CustomButton func={handleAddItem} title='Cadastrar quest'/>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: '#FFFFFF',
    },
    title: {
      fontSize: 28,
      color: '#4CAF50',
      textAlign: 'center',
      marginVertical: 20,
      fontWeight: 'bold',
    },
    section: {
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#4CAF50',
      paddingBottom: 10,
    },
    label: {
      fontSize: 16,
      color: '#4CAF50',
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#4CAF50',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    textArea: {
      height: 80,
    },
  });
  