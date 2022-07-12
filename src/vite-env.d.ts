/// <reference types="vite/client" />
/// <reference types="@honkhonk/vite-plugin-svgr/client" />

declare module "*.otf" {
  const value: string;
  export default value;
}
