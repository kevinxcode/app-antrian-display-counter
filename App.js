import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './LoginScreen';

export default function App() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [urlHistory, setUrlHistory] = useState([]);
  const [showWebView, setShowWebView] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    loadHistory();
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showWebView) {
        setShowWebView(false);
        return true;
      }
      return false;
    });

    return () => {
      backHandler.remove();
    };
  }, [showWebView]);

  const loadHistory = async () => {
    try {
      const [history, session] = await Promise.all([
        AsyncStorage.getItem('urlHistory'),
        AsyncStorage.getItem('activeSession')
      ]);
      
      if (history) {
        setUrlHistory(JSON.parse(history));
      }
      
      if (session) {
        setCurrentUrl(session);
        setShowWebView(true);
      }
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const saveToHistory = async (url) => {
    try {
      const newHistory = [url, ...urlHistory.filter(item => item !== url)].slice(0, 10);
      await AsyncStorage.setItem('urlHistory', JSON.stringify(newHistory));
      setUrlHistory(newHistory);
    } catch (error) {
      console.log('Error saving history:', error);
    }
  };

  const formatUrl = (input) => {
    if (!input.trim()) return '';
    
    // Jika sudah ada http/https, gunakan langsung
    if (input.startsWith('http://') || input.startsWith('https://')) {
      return input;
    }
    
    // Jika format IP:port atau domain, tambahkan http://
    if (input.match(/^\d+\.\d+\.\d+\.\d+(:\d+)?$/) || input.includes('.')) {
      return `http://${input}`;
    }
    
    return input;
  };

  const saveSession = async (url) => {
    try {
      await AsyncStorage.setItem('activeSession', url);
    } catch (error) {
      console.log('Error saving session:', error);
    }
  };

  const clearSession = async () => {
    try {
      await AsyncStorage.removeItem('activeSession');
    } catch (error) {
      console.log('Error clearing session:', error);
    }
  };

  const openWebView = () => {
    if (!currentUrl.trim()) {
      Alert.alert('Error', 'Masukkan IP atau URL terlebih dahulu');
      return;
    }
    
    const formattedUrl = formatUrl(currentUrl);
    saveToHistory(formattedUrl);
    saveSession(formattedUrl);
    setCurrentUrl(formattedUrl);
    setShowWebView(true);
  };

  const selectFromHistory = (url) => {
    setCurrentUrl(url);
  };

  if (showWebView) {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <WebView
          source={{ uri: currentUrl }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={false}
          allowsFullscreenVideo={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          mixedContentMode="compatibility"
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          cacheEnabled={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
          pinchGestureEnabled={true}
        />
        <TouchableOpacity 
          style={styles.exitButton}
          onPress={() => {
            clearSession();
            setShowWebView(false);
          }}
        >
          <Text style={styles.exitText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LoginScreen
      currentUrl={currentUrl}
      setCurrentUrl={setCurrentUrl}
      urlHistory={urlHistory}
      onOpenWebView={openWebView}
      onSelectFromHistory={selectFromHistory}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  webview: {
    flex: 1,
  },
  exitButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  exitText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
