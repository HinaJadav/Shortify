import { FlatList, StyleSheet, View } from 'react-native';
import { Entry } from '../types/entry';
import EntryRow from '../components/EntryRows';

const now = Date.now();

const SAMPLE_ENTRIES: Entry[] = [
  {
    id: 1,
    key: 'email',
    value: 'hina@example.com',
    isPinned: true,
    useCount: 5,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    key: 'phone',
    value: '+91 98765 43210',
    isPinned: false,
    useCount: 12,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    key: 'address',
    value: '12 MG Road\nAhmedabad',
    isPinned: false,
    useCount: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    key: 'github',
    value: 'github.com/HinaJadav',
    isPinned: true,
    useCount: 8,
    createdAt: now,
    updatedAt: now,
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={SAMPLE_ENTRIES}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <EntryRow entry={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
