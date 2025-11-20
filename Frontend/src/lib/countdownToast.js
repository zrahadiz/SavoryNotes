import { toast } from "./toast";

export const startLogoutCountdown = (seconds, onComplete) => {
  let remaining = seconds;

  const updateToast = (count) => {
    toast(
      `Session expired. Logging out in ${count} second${
        count !== 1 ? "s" : ""
      }...`,
      {
        type: "error",
        duration: count > 0 ? 1100 : 500,
      }
    );
  };

  updateToast(remaining);

  const interval = setInterval(() => {
    remaining--;

    if (remaining > 0) {
      updateToast(remaining);
    } else {
      clearInterval(interval);
      if (onComplete) {
        onComplete();
      }
    }
  }, 1000);

  return interval;
};
