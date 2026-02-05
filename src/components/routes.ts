import { Routes, Route } from "@nano-router/router";

export const routes = new Routes(
  new Route("home", "/"),
  new Route("comment", "/comments/:id"),
  new Route("story", "/stories/:id"),
);
