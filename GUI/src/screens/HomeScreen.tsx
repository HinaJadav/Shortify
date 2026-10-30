import { FlatList, StyleSheet, View } from 'react-native';

import EntryRow from '../components/EntryRows';
import useEntries from '../hooks/useEntries';
import AddEntryForm from '../components/AddEntryForm';

export default function HomeScreen() {
  const { entries, deleteEntry, addEntry } = useEntries();

  return (
    <View style={styles.container}>
      <AddEntryForm onAdd={addEntry} />
      <FlatList
        data={entries}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <EntryRow entry={item} onDelete={deleteEntry} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
