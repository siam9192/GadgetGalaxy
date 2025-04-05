import { useEffect, useState } from "react";

interface IProps {
  isLoading: boolean;
  delay?: number;
}
const useLoadingBounce = ({ isLoading, delay = 1000 }: IProps) => {
  const [bouncedLoading, setBouncedLoading] = useState(true);
  useEffect(() => {
    setBouncedLoading(true);
    const timeout = setTimeout(() => {
      if (!isLoading) {
        setBouncedLoading(false);
      } else {
        setBouncedLoading(true);
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [isLoading]);
  return bouncedLoading;
};

export default useLoadingBounce;
