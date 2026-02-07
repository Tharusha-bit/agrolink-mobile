import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
// We import the file you just created in the root folder
import RiskScreen from '../../RiskScreen'; 

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <RiskScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});