import { useState } from 'react';
import { TextInput, View, StyleSheet, Text, Pressable } from 'react-native';

interface AddEntryFormProp {
  onAdd: (key: string, value: string) => string | null;
}

export default function AddEntryForm({ onAdd }: AddEntryFormProp) {
  const [keyText, setKeyText] = useState('');
  const [valueText, setValueText] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleAdd = () => {
    const result = onAdd(keyText, valueText);

    if (result) {
      setErrorText(result);
      return;
    }

    setKeyText('');
    setValueText('');
    setErrorText(null);
  };
  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Key (e.g. hn_email)"
        value={keyText}
        onChangeText={setKeyText}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, styles.valueInput]}
        placeholder="Value"
        value={valueText}
        onChangeText={setValueText}
        multiline
      />
      {errorText && <Text style={styles.error}>{errorText}</Text>}
      <Pressable style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  valueInput: { minHeight: 60, textAlignVertical: 'top' },
  error: { color: 'red' },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
