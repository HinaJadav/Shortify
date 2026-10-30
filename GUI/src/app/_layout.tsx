import { Stack } from 'expo-router';

// Wraps every screen; <Stack> gives stack navigation and a header bar
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Shortify' }} />
    </Stack>
  );
}
