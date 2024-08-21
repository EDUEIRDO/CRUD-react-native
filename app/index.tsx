import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { db } from '@/utils/firebase';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/customButton';

interface Alternativa {
  id: string;
  texto: string;
  correta: boolean;
}

interface Questao {
  id: string;
  enunciado: string;
  alternativas: Alternativa[];
}

export default function Home () {
  const router = useRouter();
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [enunciado, setEnunciado] = useState('');
  const [alternativas, setAlternativas] = useState<Alternativa[]>([
    { id: '1', texto: '', correta: false },
    { id: '2', texto: '', correta: false },
    { id: '3', texto: '', correta: false },
    { id: '4', texto: '', correta: false },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'questoes'));
        const items: Questao[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Questao);
        });
        setQuestoes(items);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  const handleAddQuestao = async () => {
    if (enunciado === '' || alternativas.some((alt) => alt.texto === '')) {
      Alert.alert('Erro', 'Por favor preencha todos os campos');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'questoes'), {
        enunciado,
        alternativas,
      });
      setQuestoes([...questoes, { id: docRef.id, enunciado, alternativas }]);
      setEnunciado('');
      setAlternativas([
        { id: '1', texto: '', correta: false },
        { id: '2', texto: '', correta: false },
        { id: '3', texto: '', correta: false },
        { id: '4', texto: '', correta: false },
      ]);
      Alert.alert('Sucesso', 'Questão cadastrada com sucesso');
      router.push('/tela')
    } catch (error) {
      console.error('Erro ao adicionar questão:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a questão');
    }
  };

  const handleAlternativaChange = (index: number, texto: string) => {
    const novasAlternativas = [...alternativas];
    novasAlternativas[index].texto = texto;
    setAlternativas(novasAlternativas);
  };

  const handleCorretaChange = (index: number) => {
    const novasAlternativas = alternativas.map((alt, i) => ({
      ...alt,
      correta: i === index,
    }));
    setAlternativas(novasAlternativas);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro de Questão</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Enunciado*</Text>
        <TextInput style={styles.input} placeholder="Texto da questão" value={enunciado} onChangeText={setEnunciado} />
      </View>
      {alternativas.map((alternativa, index) => (
        <View key={alternativa.id} style={styles.section}>
          <Text style={styles.label}>Alternativa {index + 1}*</Text>
          <TextInput
            style={styles.input}
            placeholder={`Texto da alternativa ${index + 1}`}
            value={alternativa.texto}
            onChangeText={(texto) => handleAlternativaChange(index, texto)}
          />
          <CustomButton
            title={alternativa.correta ? "Correta" : "Marcar como correta"}
            func={() => handleCorretaChange(index)}
          />
        </View>
      ))}
      <CustomButton func={handleAddQuestao} title='Cadastrar Questão' />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: 10,
      backgroundColor: '#FFFFFF',
    },
    title: {
      fontSize: 28,
      color: 'blue',
      textAlign: 'center',
      marginVertical: 20,
      fontWeight: 'bold',
    },
    section: {
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: 'blue',
      paddingBottom: 10,
    },
    label: {
      fontSize: 16,
      color: 'black',
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: 'blue',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    textArea: {
      height: 80,
    },
  });
  