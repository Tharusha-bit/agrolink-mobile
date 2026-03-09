import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function InvestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Invest Marketplace Coming Soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9F4",
  },
  text: { fontSize: 18, fontWeight: "bold", color: "#216000" },
});
