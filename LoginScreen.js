import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ currentUrl, setCurrentUrl, urlHistory, onOpenWebView, onSelectFromHistory }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.gradient}>
          <View style={styles.formContainer}>
            <Text style={styles.title}> Display Sistem Antrian</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={currentUrl}
                onChangeText={setCurrentUrl}
                placeholder="Masukkan IP (192.168.1.100:3000/display) atau URL"
                placeholderTextColor="#ccc"
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={true}
                keyboardType="url"
              />
              
              <TouchableOpacity 
                style={styles.button} 
                onPress={onOpenWebView}
              >
                <Text style={styles.buttonText}>Buka</Text>
              </TouchableOpacity>
            </View>
            
            {urlHistory.length > 0 && (
              <View style={styles.historyContainer}>
                <Text style={styles.historyTitle}>History URL:</Text>
                <FlatList
                  data={urlHistory}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={styles.historyItem}
                      onPress={() => onSelectFromHistory(item)}
                    >
                      <Text style={styles.historyText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    fontSize: 20,
    marginRight: 15,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#4c669f',
    fontSize: 20,
    fontWeight: 'bold',
  },
  historyContainer: {
    flex: 1,
    maxHeight: 300,
  },
  historyTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  historyItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 8,
  },
  historyText: {
    color: 'white',
    fontSize: 18,
  },
});