import { useMemo } from "react";
import { Router } from "@nano-router/react";
import { createBrowserHistory } from "@nano-router/history";
import { RootRoute } from "./RootRoute";
import { routes } from "./routes";

export const App = () => {
  const history = useMemo(() => createBrowserHistory(), []);

  return (
    <Router history={history} routes={routes}>
      <RootRoute />
    </Router>
  );
};
