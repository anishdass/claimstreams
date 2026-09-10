import { PulseLoader } from "react-spinners";

const Loader = ({ color, size, margin, speedMultiplier }) => {
  return (
    <PulseLoader
      color={color}
      size={size}
      margin={margin}
      speedMultiplier={speedMultiplier}
    />
  );
};

export default Loader;
