import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, BoodooProvider } from 'boodoo/react-native';

export function CardExample() {
  return (
    <BoodooProvider>
      <View style={styles.container}>
        <Card variant="elevated">
          <Text style={styles.title}>Card Title</Text>
          <Text style={styles.body}>Card body content using Boodoo mobile tokens.</Text>
        </Card>
      </View>
    </BoodooProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: '#666',
  },
});