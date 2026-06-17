import { type UserConfig, defineConfig } from "vite";
import monkey, { type MonkeyOption } from "vite-plugin-monkey";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "vite-plugin-tailwind";
import tsconfigPaths from "vite-tsconfig-paths";

interface CustomViteOptions extends MonkeyOption {
  framework?: "solid" | "vanilla";
}

export function createViteConfig(options: CustomViteOptions): UserConfig {
  const { framework = "solid", ...monkeyOptions } = options;
  const plugins: UserConfig["plugins"] = [
    ...(framework === "solid" ? [solidPlugin()] : []),
    {
      name: "set-headers",
      apply: "serve",
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Access-Control-Request-Private-Network", "true");
          res.setHeader("Access-Control-Allow-Private-Network", "true");
          res.setHeader("Access-Control-Allow-Origin", "*");
          next();
        });
      }
    },
    tsconfigPaths(),
    tailwindcss(),
    monkey(monkeyOptions)
  ];
  return defineConfig({ plugins });
}
