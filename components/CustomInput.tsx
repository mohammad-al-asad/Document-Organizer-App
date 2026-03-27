import { colors } from "@/config/colors";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { verticalScale } from "react-native-size-matters";

interface CustomInputProps extends TextInputProps {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  labelColor?: string;
  isPassword?: boolean;
  error?: string;
}

const CustomInput = ({
  label,
  icon,
  placeholder,
  isPassword,
  error,
  labelColor = colors.text,
  onFocus,
  onBlur,
  ...props
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isEyeOpen, setIsEyeOpen] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
        ]}
      >
        {icon}

        <TextInput
          {...props}
          placeholder={placeholder}
          placeholderTextColor={colors.subtleText}
          style={styles.input}
          secureTextEntry={isPassword && !isEyeOpen}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
        />

        {isPassword && (
          <Feather
            onPress={() => setIsEyeOpen(!isEyeOpen)}
            name={isEyeOpen ? "eye" : "eye-off"}
            size={20}
            color={colors.subtleText}
          />
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: verticalScale(55),
    backgroundColor: colors.surface,
  },
  inputContainerFocused: {
    borderColor: colors.main,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: colors.text,
  },
  label: {
    fontWeight: "700",
    fontSize: 13,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
  },
});
