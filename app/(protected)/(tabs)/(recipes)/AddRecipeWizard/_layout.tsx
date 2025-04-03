import { Stack } from 'expo-router';

export default function AddRecipeWizardLayout() {
  return (
    <Stack screenOptions={{
        headerShown: false, // 关键：隐藏Expo Router标题
      }}>
      <Stack.Screen name="Step1SelectImage" options={{ title: 'Step 1: Image' }} />
      <Stack.Screen name="Step2ModeSelect"  options={{ title: 'Step 2: Mode' }} />
      <Stack.Screen name="Step3EditConfirm" options={{ title: 'Step 3: Edit & Confirm' }} />
    </Stack>
  );
}
