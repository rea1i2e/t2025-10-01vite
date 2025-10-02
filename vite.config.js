import { defineConfig } from "vite";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import liveReload from "vite-plugin-live-reload";
import sassGlobImports from "vite-plugin-sass-glob-import";
import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "glob";
import viteImagemin from "@vheemstra/vite-plugin-imagemin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// src配下のHTMLを全部エントリに
const htmlFiles = globSync("src/**/*.html");

export default defineConfig({
  root: "src",
  base: "./",
  server: {
    host: true,   // ← 同一LANのスマホから見られる
    open: true
  },
  build: {
    outDir: path.resolve(__dirname, "dist"), // vite-plugin-imageminでは、root: path.resolve(__dirname)が必要
    emptyOutDir: true,
    rollupOptions: {
      // input: {
      //   index: "index.html",
      // },
      input: Object.fromEntries(
        htmlFiles.map((file) => [
          // エイリアス名（拡張子なし・root 相対）
          file.replace(/^src\//, "").replace(/\.html$/, ""),
          // 値は絶対パス
          resolve(__dirname, file),
        ])
      ),
      output: {
        assetFileNames: (info) => {
          const n = info.name ?? "";
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(n))
            return "assets/images/[name]-[hash][extname]";
          if (/\.css$/i.test(n)) return "assets/css/[name]-[hash][extname]";
          return "assets/[name]-[hash][extname]";
        },
        entryFileNames: "assets/js/[name]-[hash].js",
        chunkFileNames: "assets/js/[name]-[hash].js"
      }
    }
  },
  plugins: [
    // HTML内の EJS を展開（データはここで一元管理）
    ViteEjsPlugin({
      siteName: "静的サイト用ejsテンプレ",
      siteUrl: "https://example.com"
    }),
    // .ejs 変更のライブリロード
    liveReload(["src/**/*.ejs"]),
    // Sass の @use / @forward でグロブを使える（Vite6）
    sassGlobImports(),
    // 画像圧縮（ビルド後に after-build で <picture> 化）
    viteImagemin({
      root: path.resolve(__dirname),
      onlyAssets: true,
      include: /\.(png|jpe?g|gif|svg)$/i,
      plugins: {
        jpg: (await import("imagemin-mozjpeg")).default({ quality: 75, progressive: true }),
        png: (await import("imagemin-pngquant")).default({ quality: [0.65, 0.8], speed: 3 }),
        gif: (await import("imagemin-gifsicle")).default({ optimizationLevel: 2 }),
        svg: (await import("imagemin-svgo")).default()
      },
      makeWebp: {
        plugins: {
          jpg: (await import("imagemin-webp")).default({ quality: 75 }),
          png: (await import("imagemin-webp")).default({ quality: 75 })
        },
        formatFilePath: (file) => file.replace(/\.(jpe?g|png)$/i, ".webp"),
        skipIfLargerThan: "optimized"
      }
    })
  ]
});