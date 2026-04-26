
import { useThemeStore } from "@/app/stores";
import { Stars } from "@react-three/drei";

const StarsContainer = () => {
  const isDarkTheme = useThemeStore((state) => state.theme.type === 'dark');

  if (!isDarkTheme) return null;

  return (
    <Stars radius={200} depth={150} count={8000} factor={12} saturation={10} fade={true} speed={1.5} />
  );
};

export default StarsContainer;