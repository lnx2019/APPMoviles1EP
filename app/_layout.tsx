import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SolicitudProvider } from '../src/context/SolicitudContext';

export default function RootLayout() {
  return (
    <SolicitudProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" options={{ headerShown: true, title: 'Iniciar Sesión', headerBackTitle: 'Atrás' }} />
        <Stack.Screen name="solicitudes/index" options={{ headerShown: true, title: 'Solicitudes', headerBackTitle: 'Atrás' }} />
        <Stack.Screen name="solicitudes/crear" options={{ headerShown: true, title: 'Nueva Solicitud', presentation: 'modal' }} />
        <Stack.Screen name="solicitudes/[id]" options={{ headerShown: true, title: 'Detalle', headerBackTitle: 'Atrás' }} />
      </Stack>
    </SolicitudProvider>
  );
}
