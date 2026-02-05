/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

declare module "*.gif" {
  const src: string;
  export default src;
}
