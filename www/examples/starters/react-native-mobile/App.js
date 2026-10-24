import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  BoodooProvider,
  Card,
  Button,
  Badge,
  Text,
  TextInput,
  useTheme,
} from 'boodoo/react-native';

function HomeScreen() {
  const [name, setName] = useState('');
  const [likes, setLikes] = useState(0);
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Badge variant="soft" style={styles.badge}>
            boodoo Mobile
          </Badge>
          <Text variant="h2" style={styles.title}>
            iOS &amp; Android Starter
          </Text>
          <Text variant="lead" style={styles.subtitle}>
            Lightweight, native components with zero Material 3 overhead.
          </Text>
        </View>

        <Card variant="elevated" style={styles.card}>
          <Card.Title
            title="Interactive Mobile Demo"
            subtitle="Drop-in alternative to React Native Paper"
          />
          <Card.Content>
            <TextInput
              label="Developer Name"
              placeholder="e.g. Satoshi"
              value={name}
              onChangeText={setName}
            />
            <View style={styles.badgeRow}>
              <Badge variant="primary">iOS &amp; Android</Badge>
              <Badge variant="success">Zero Bloat</Badge>
              <Badge variant="secondary">Likes: {likes}</Badge>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button
              variant="outline"
              size="sm"
              onPress={() => setLikes(0)}
            >
              Reset
            </Button>
            <Button
              variant="primary"
              size="sm"
              onPress={() => setLikes(likes + 1)}
            >
              Like App 👍
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <BoodooProvider theme="light">
      <HomeScreen />
    </BoodooProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
    textAlign: 'center',
  },
  badge: {
    marginBottom: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
});
