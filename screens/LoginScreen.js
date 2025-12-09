import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { signInWithGitHub } from '../services/auth'; 

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleGitHubLogin = async () => {
    setLoading(true);
    const user = await signInWithGitHub();
    setLoading(false);

    if (user) {
      // Giriş başarılı, uygulamaya devam edebilir
      Alert.alert('Hoş Geldiniz!', `Ücretsiz Giriş Başarılı: ${user.username}`);
      // Gerçek projede buraya Dersler ekranına yönlendirme (navigation) kodu gelir.
    } else {
      Alert.alert('Giriş Başarısız', 'GitHub ile ücretsiz oturum açılırken bir sorun oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DersLig Mobil</Text>
      <Text style={styles.subtitle}>GitHub Hesabınla Ücretsiz Başla!</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#4078c0" /> 
      ) : (
        <Button
          title="🔑 GitHub ile Ücretsiz Giriş Yap"
          onPress={handleGitHubLogin}
          color="#4078c0" 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    color: '#666',
  },
});

export default LoginScreen;
