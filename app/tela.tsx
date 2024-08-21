import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { db } from '@/utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

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

export default function Tela() {
  const [questoes, setQuestoes] = useState<Questao[]>([]);

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
        console.error('Erro ao buscar as questões:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {questoes.map((questao) => (
        <View key={questao.id} style={styles.questaoContainer}>
          <Text style={styles.enunciado}>{questao.enunciado}</Text>
          {questao.alternativas.map((alternativa, index) => (
            <Text
              key={alternativa.id}
              style={alternativa.correta ? styles.alternativaCorreta : styles.alternativa}
            >
              {index + 1}. {alternativa.texto}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f4f4f4',
      },
      questaoContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
      },
      enunciado: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
      },
      alternativa: {
        fontSize: 16,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginBottom: 5,
        borderRadius: 5,
        backgroundColor: '#e0e0e0',
      },
      alternativaCorreta: {
        backgroundColor: '#c8e6c9', // Verde claro para indicar a resposta correta
        fontWeight: 'bold',
      },
    });