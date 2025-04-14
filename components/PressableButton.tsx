import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
  } from 'react-native';
  import React from 'react';
  
  interface PressableButtonProps {
    pressedHandler: () => void;
    pressedInHandler?: () => void;
    pressedStyle?: StyleProp<ViewStyle>;
    children: React.ReactNode;
    componentStyle?: StyleProp<ViewStyle>;
  }
  
  export default function PressableButton({
    children,
    pressedHandler,
    pressedStyle,
    componentStyle,
    pressedInHandler,
  }: PressableButtonProps) {
    return (
      <Pressable
        onPressIn={pressedInHandler}
        onPress={pressedHandler}
        style={({ pressed }) => [
          styles.base,
          componentStyle,
          pressed && styles.pressed,
          pressed && pressedStyle,
        ]}
      >
        <View style={styles.content}>{children}</View>
      </Pressable>
    );
  }
  
  const styles = StyleSheet.create({
    base: {
      backgroundColor: '#007AFF',
      borderRadius: 24,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 1 },
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pressed: {
      opacity: 0.6,
    },
  });
  