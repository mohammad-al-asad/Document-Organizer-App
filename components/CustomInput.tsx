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
}

const CustomInput = ({
  label,
  icon,
  placeholder,
  isPassword,
  labelColor = colors.text,
  ...props
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isEyeOpen, setIsEyeOpen] = useState(false);

  return (
    <View>
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
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
    marginBottom: 8,
    fontSize: 13,
  },
});
