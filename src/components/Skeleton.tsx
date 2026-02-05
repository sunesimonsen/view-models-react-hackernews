import { memo, useMemo } from "react";

export const Skeleton = memo(() => {
  const width = useMemo(() => `${Math.random() * 100 + 500}px`, []);

  return <div className="skeleton" style={{ width }} />;
});

Skeleton.displayName = "Skeleton";
