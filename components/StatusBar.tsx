import { StatusBar } from "react-native";

interface Props {
  barStyle?: "default" | "light-content" | "dark-content";
  backgroundColor?: string;
}

const CustomStatusBar = ({
  backgroundColor = "transparent",
  barStyle = "default",
}: Props) => {
  return <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />;
};

export default CustomStatusBar;
