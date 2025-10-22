import { Tabs } from 'expo-router';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>

      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
        }}
      />

      <Tabs.Screen
        name="estadisticas"
        options={{
          title: 'Estadísticas',
        }}
      />

      <Tabs.Screen
        name="informacion"
        options={{
          title: 'Información',
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
        }}
      />
    </Tabs>
  );
}
