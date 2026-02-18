import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Header with Logout */}
      <View style={styles.header}>
        <View>
          <Text variant="headlineSmall">Hello, Udani</Text>
          <Text variant="bodyMedium">Investor Dashboard</Text>
        </View>
        <Button mode="text" onPress={() => router.replace('/')}>Logout</Button>
      </View>

      {/* Feature A: AI Portfolio Generator (Your Individual Contribution) */}
      <Card style={styles.card}>
        <Card.Title 
          title="AI Portfolio Generator" 
          left={(props) => <Avatar.Icon {...props} icon="robot" style={{backgroundColor: '#2e7d32'}} />} 
        />
        <Card.Content>
          <Text variant="bodyMedium">Let AI diversify your investment to minimize risk based on weather & soil data.</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" style={{backgroundColor: '#2e7d32'}}>Generate Now</Button>
        </Card.Actions>
      </Card>

      {/* Feature B: Trust Score Display */}
      <Text variant="titleMedium" style={styles.sectionTitle}>Active Projects</Text>

      <Card style={styles.projectCard}>
        <Card.Cover source={{ uri: 'https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg' }} />
        <Card.Title 
            title="Saman's Paddy Field" 
            subtitle="Anuradhapura | Rice" 
        />
        <Card.Content>
            <View style={styles.badgeContainer}>
                <Text style={styles.trustLabel}>Trust Score:</Text>
                {/* This mimics the dynamic score you will build later */}
                <Text style={styles.trustScoreGold}>95/100 (Gold)</Text>
            </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  header: { marginBottom: 20, marginTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  card: { marginBottom: 20, backgroundColor: '#e8f5e9' },
  sectionTitle: { marginBottom: 10, fontWeight: 'bold' },
  projectCard: { marginBottom: 15, border: 1 },
  badgeContainer: { flexDirection: 'row', marginTop: 10 },
  trustLabel: { fontWeight: 'bold', marginRight: 5 },
  trustScoreGold: { color: '#f9a825', fontWeight: 'bold' }
});