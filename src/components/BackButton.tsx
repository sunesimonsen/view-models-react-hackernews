import { memo, useCallback } from "react";
import { useRouter } from "@nano-router/react";

export const BackButton = memo(() => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <button className="back-button" onClick={handleClick}>
      X
    </button>
  );
});

BackButton.displayName = "BackButton";
