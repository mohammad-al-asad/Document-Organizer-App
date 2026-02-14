import { colors } from "@/config/colors";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary";
  textStyle?: any;
}

export const CustomButton = ({
  title,
  variant = "primary",
  style,
  textStyle,
  ...props
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        variant === "secondary" && styles.secondary,
      ]}
      activeOpacity={0.8}
      {...props}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.btn,
    paddingVertical: verticalScale(16),
    borderRadius: scale(30),
    alignItems: "center",
    width: "100%",
    marginVertical: verticalScale(18),
  },
  text: {
    color: colors.btnText,
    fontSize: 18,
    fontWeight: "700",
  },
  secondary: {},
});
