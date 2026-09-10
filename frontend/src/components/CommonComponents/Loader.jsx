import { PulseLoader } from "react-spinners";

const Loader = ({ color, size, margin, speedMultiplier }) => {
  return (
    <PulseLoader
      color={color || "#6366f1"}
      size={size || 12}
      margin={margin || 4}
      speedMultiplier={speedMultiplier || "0.5"}
    />
  );
};

export default Loader;
