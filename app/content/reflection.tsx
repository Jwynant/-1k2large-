import { StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ContentForm from '../../components/content/ContentForm';
import { useAppContext } from '../context/AppContext';

export default function AddReflectionScreen() {
  const { state } = useAppContext();
  const params = useLocalSearchParams<{ 
    year: string;
    month?: string;
    week?: string;
  }>();
  
  // Parse parameters
  const selectedCell = {
    year: parseInt(params.year || '0', 10),
    month: params.month ? parseInt(params.month, 10) : undefined,
    week: params.week ? parseInt(params.week, 10) : undefined,
  };
  
  // Use the current selected cell if no parameters are provided
  const cell = selectedCell.year > 0 
    ? selectedCell 
    : state.selectedCell || { year: new Date().getFullYear() };
  
  return (
    <SafeAreaView style={styles.container}>
      <ContentForm 
        contentType="reflection"
        selectedCell={cell}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
}); 