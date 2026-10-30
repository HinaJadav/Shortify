import { Entry } from '../types/entry';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface EntryRowsProps {
  entry: Entry;
  onDelete: (id: number) => void;
}

export default function EntryRow({ entry, onDelete }: EntryRowsProps) {
  return (
    <View style={styles.row}>
      <View style={styles.content}>
        <Text style={styles.key}>
          {entry.isPinned ? '📌 ' : ''}
          {entry.key}
        </Text>
        <Text>{entry.value}</Text>
        <Text style={styles.meta}>Used {entry.useCount} times</Text>
      </View>
      <Pressable onPress={() => onDelete(entry.id)} hitSlop={8}>
        <Text style={styles.delete}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  content: { flex: 1 },
  key: { fontWeight: 'bold', marginBottom: 4 },
  meta: { color: 'gray', fontSize: 12, marginTop: 4 },
  delete: { color: 'red', fontWeight: 'bold', marginLeft: 12 },
});
