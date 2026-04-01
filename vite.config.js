import { defineConfig } from "vite";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import liveReload from "vite-plugin-live-reload";
import sassGlobImports from "vite-plugin-sass-glob-import";
import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { globSync } from "glob";
import viteImagemin from "@vheemstra/vite-plugin-imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminOptipng from "imagemin-optipng";
import imageminGifsicle from "imagemin-gifsicle";
import imageminSvgo from "imagemin-svgo";
import imageminWebp from "imagemin-webp";
import imageminAvif from "imagemin-avif";
// imagemin-gif2webp は CJS なので default import の互換に依存せず、名前空間受け取りにします
import gif2webpCjs from 'imagemin-gif2webp';
import { siteConfig } from "./config/site.config.js";
import { posts } from "./src/ejs/data/posts.js";
const imageminGif2webp = gif2webpCjs;

const { imageAltFormats, useFileHash, minify } = siteConfig;
const makeWebpEnabled = imageAltFormats === 'webp' || imageAltFormats === 'both';
const makeAvifEnabled = imageAltFormats === 'avif' || imageAltFormats === 'both';
const hash = useFileHash ? '-[hash]' : '';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

// src配下のHTMLを全部エントリに（publicディレクトリを除外）
const htmlFiles = globSync("src/**/*.html", {
  ignore: ["src/public/**/*.html"]
});

export default defineConfig({
  root: "src",
  base: "./",
  server: {
    host: true,
    open: true
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    minify,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: Object.fromEntries(
        htmlFiles.map((file) => [
          file.replace(/^src\//, "").replace(/\.html$/, ""),
          resolve(__dirname, file),
        ])
      ),
      output: {
        assetFileNames: (info) => {
          const n = (info.name ?? "").replaceAll("\\", "/");
          // 動画ファイルを assets/videos/ に配置
          if (/\.(mp4|webm|mov|ogv)$/i.test(n)) {
            return `assets/videos/[name]${hash}[extname]`;
          }
          // 画像ファイルを assets/images/ に配置
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(n)) {
            return `assets/images/[name]${hash}[extname]`;
          }
          // フォントファイルを assets/fonts/ に配置
          if (/\.(woff2?|ttf|otf|eot)$/i.test(n)) {
            return `assets/fonts/[name]${hash}[extname]`;
          }
          // 音声ファイルを assets/audio/ に配置
          if (/\.(mp3|ogg|wav|m4a)$/i.test(n)) {
            return `assets/audio/[name]${hash}[extname]`;
          }
          if (/\.css$/i.test(n)) return `assets/css/[name]${hash}[extname]`;
          return `assets/[name]${hash}[extname]`;
        },
        entryFileNames: `assets/js/[name]${hash}.js`,
        chunkFileNames: `assets/js/[name]${hash}.js`
      }
    }
  },
  plugins: [
    ViteEjsPlugin({
      ...siteConfig,
      posts,
    }),
    liveReload(["ejs/**/*.ejs"]),
    sassGlobImports(),
    // 画像圧縮と WebP/AVIF 変換（config/site.config.js の imageAltFormats で制御）
    viteImagemin({
      root: path.resolve(__dirname), // 絶対パスを維持（相対パスNG）
      onlyAssets: true,
      include: /\.(png|jpe?g|gif|svg)$/i,
      plugins: {
        jpg: imageminMozjpeg({ quality: 75, progressive: true }),
        png: imageminOptipng({ optimizationLevel: 2 }),
        gif: imageminGifsicle({ optimizationLevel: 2 }),
        svg: imageminSvgo()
      },
      ...(makeWebpEnabled && {
        makeWebp: {
          plugins: {
            jpg: imageminWebp({ quality: 75 }),
            png: imageminWebp({ quality: 75 }),
            gif: imageminGif2webp({ quality: 75 }),
          },
          formatFilePath: (file) => file.replace(/\.(jpe?g|png|gif)$/i, ".webp"),
          skipIfLargerThan: "optimized"
        }
      }),
      ...(makeAvifEnabled && {
        makeAvif: {
          plugins: {
            jpg: imageminAvif({ quality: 50 }),
            png: imageminAvif({ quality: 50 }),
          },
          formatFilePath: (file) => file.replace(/\.(jpe?g|png)$/i, ".avif"),
          skipIfLargerThan: "optimized"
        }
      })
    })
  ]
});