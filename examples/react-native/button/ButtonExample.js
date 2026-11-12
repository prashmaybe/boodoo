import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, BoodooProvider } from 'boodoo/react-native';

export function ButtonExample() {
  return (
    <BoodooProvider>
      <View style={styles.container}>
        <Button title="Primary Action" variant="primary" onPress={() => console.log('Pressed')} />
      </View>
    </BoodooProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
  },
});