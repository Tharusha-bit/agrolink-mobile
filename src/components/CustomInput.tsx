import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../constants/Colors'; // <--- IMPORT THIS

interface Props {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
}

export default function CustomInput({ label, value, onChangeText, placeholder, secureTextEntry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, { backgroundColor: Colors.inputBackground }]}> 
        {/* ^^^ UPDATED COLOR HERE */}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.placeholderText} // Updated text color
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    width: '35%',
  },
  inputContainer: {
    width: '60%',
    // backgroundColor is now handled inline above
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 15,
    height: 45,
    justifyContent: 'center',
  },
  input: {
    color: Colors.white,
    fontSize: 14,
    width: '100%',
  },
});