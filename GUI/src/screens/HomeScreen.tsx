import { FlatList, StyleSheet, View } from 'react-native';

import EntryRow from '../components/EntryRows';
import useEntries from '../hooks/useEntries';
import AddEntryForm from '../components/AddEntryForm';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { entries, deleteEntry, addEntry } = useEntries();

   const insets = useSafeAreaInsets(); // NEW (temporary)
  console.log('insets', insets);      // NEW (temporary)

  return (
    <SafeAreaView style={styles.container} edges={['bottom','left','right']}>
      <AddEntryForm onAdd={addEntry} />
      <FlatList
        data={entries}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <EntryRow entry={item} onDelete={deleteEntry} />
        )}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
