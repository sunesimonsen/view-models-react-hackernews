import { memo, type ReactNode } from "react";
import { useLink } from "@nano-router/react";

interface LinkButtonProps {
  children: ReactNode;
  route: string;
  params?: Record<string, string>;
}

export const LinkButton = memo(({ children, route, params }: LinkButtonProps) => {
  const linkProps = useLink({ route, params });

  return (
    <a className="link-button" {...linkProps}>
      {children}
    </a>
  );
});

LinkButton.displayName = "LinkButton";
