import { Entry } from '../types/entry';
import { StyleSheet, Text, View } from 'react-native';

interface EntryRowsProps {
  entry: Entry;
}

export default function EntryRow({ entry }: EntryRowsProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.key}>
        {entry.isPinned ? '📌 ' : ''}
        {entry.key}
      </Text>
      <Text>{entry.value}</Text>
      <Text style={styles.meta}>Used {entry.useCount} times</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  key: { fontWeight: 'bold', marginBottom: 4 },
  meta: { color: 'gray', fontSize: 12, marginTop: 4 },
});
