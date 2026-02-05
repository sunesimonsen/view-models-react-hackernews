import { memo, ReactNode } from "react";
import { TopBar } from "./TopBar";

type Props = {
  children: ReactNode;
};

export const DefaultLayout = memo(({ children }: Props) => {
  return (
    <main>
      <TopBar />
      <section className="content">{children}</section>
    </main>
  );
});
