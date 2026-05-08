## Daftar Isi

1. [Quick Start](#1-quick-start)
2. [Struktur Project](#2-struktur-project)
3. [Aturan Development](#3-aturan-development)
4. [peerDependencies vs dependencies](#4-peerdependencies-vs-dependencies)
5. [Menambahkan Workspace Baru](#5-menambahkan-workspace-baru)
6. [Menambahkan App Baru](#6-menambahkan-app-baru)
7. [Menjalankan Project](#7-menjalankan-project)
8. [Troubleshooting](#8-troubleshooting)
9. [Konvensi Penamaan](#9-konvensi-penamaan)

---

## 1. Quick Start

Clone repo, masuk ke foldernya, lalu install seluruh dependency dengan **pnpm**:

```bash
git clone https://github.com/afrinaldi-knitto/sample-react-native-monorepo
```

```bash
cd sample-react-native-monorepo
```

```bash
pnpm install
```

> Pastikan Node.js `>= 22.11.0` dan **pnpm** sudah terpasang. Versi pnpm yang dipakai repo ini ditentukan di field `packageManager` pada [package.json](package.json).

Setelah `pnpm install` selesai, semua app & package workspace sudah ter-link otomatis. Untuk menjalankan aplikasi, gunakan script di root [package.json](package.json):

```bash
pnpm two:start      # Menjalankan Metro bundler app `two`
pnpm two:android    # Build & install ke perangkat/emulator Android
pnpm two:build      # Bundle release + assembleRelease APK
```

Pola yang sama berlaku untuk app `one` (`one:start`, `one:android`, `one:build`).

---

## 2. Struktur Project

```
sample-react-native-monorepo/
├─ apps/                  # Aplikasi React Native (entry point)
│  ├─ one/
│  └─ two/
├─ packages/              # Library lintas-app (utilities, UI, store)
│  ├─ components/
│  └─ redux/
├─ screens/               # Layar/fitur yang reusable antar app
│  └─ detail/
├─ navigations/           # Konfigurasi navigasi bersama
├─ pnpm-workspace.yaml    # Daftar glob workspace pnpm
├─ .npmrc                 # node-linker=hoisted
├─ package.json           # Script root + devDependencies
└─ tsconfig.base.json     # Base TypeScript config
```

| Folder        | contoh package                                      | Tujuan                            |
| ------------- | --------------------------------------------------- | --------------------------------- |
| `apps/*`      | `@app/one`, `@app/two`                              | Aplikasi RN yang dapat dijalankan |
| `packages/*`  | `@packages/components`, `@workspace/packages/redux` | Library lintas-app                |
| `screens/*`   | `@workspace/screens/detail`                         | Modul UI per fitur                |
| `navigations` | `@workspace/navigations`                            | Konfigurasi navigasi bersama      |

**File konfigurasi penting:**

- [pnpm-workspace.yaml](pnpm-workspace.yaml) — daftar folder yang dianggap workspace.
- [.npmrc](.npmrc) — berisi `node-linker=hoisted`, agar `node_modules` di-hoist ke root (lebih ramah untuk Metro & Gradle).
- [package.json](package.json) — kumpulan script `<app>:<task>` untuk menjalankan tiap app via `pnpm --filter`.

---

## 3. Aturan Development

Aturan yang **wajib** diikuti saat menambah kode baru:

1. **Setiap workspace WAJIB punya `package.json`** dan field `name` yang unik. `name` inilah yang dipakai sebagai identitas package saat di-import dari app lain (mis. `import { NavStack } from '@workspace/navigations'`).
2. Gunakan **scope** pada `name`:

- App → `@app/<nama>` (contoh: `@app/two`)
- Package internal → `@packages/<nama>` atau `@workspace/<area>` (contoh: `@workspace/navigations`, `@workspace/screens/detail`)

3. **Versi React, React Native, dan dependency native** harus sama di seluruh app. Letakkan versi finalnya di `dependencies` masing-masing app, bukan di package. Lihat bagian `[peerDependencies` vs `dependencies](#4-peerdependencies-vs-dependencies)`.
4. Saat sebuah package me-refer package lain dari workspace yang sama, pakai protokol pnpm: `"workspace:*"`.
5. **Jangan commit `node_modules` per-app**. Repo ini memakai `node-linker=hoisted` agar dependency di-hoist ke root, sehingga Metro & Gradle hanya perlu mengarah ke `node_modules` root.
6. Setelah menambah/mengubah `package.json` mana pun, jalankan `pnpm install` di root untuk re-link.

---

## 4. peerDependencies vs dependencies

Aturan di monorepo ini:

> **Package** (di `packages/`_, `screens/_`, `navigations`) menggunakan `peerDependencies`.
**App** (di `apps/`*) menggunakan `dependencies`.

### Mengapa?

React, React Native, dan banyak library native (`react-native-screens`, `@react-navigation/*`, `@shopify/flash-list`, dll.) **harus berjalan dalam satu instance** di runtime. Jika tiap package men-deklarasikannya sebagai `dependencies`, pnpm/Metro bisa berakhir me-resolve ke folder berbeda dan menyebabkan error seperti `Invalid hook call`, `null is not an object`, atau crash native.

Dengan `peerDependencies`:

- Package hanya **menyatakan kebutuhan** terhadap library, tanpa membawa salinan sendiri.
- App-lah yang **memenuhi** peer tersebut melalui `dependencies` di `package.json`-nya.
- Hasilnya: hanya ada satu salinan React/RN di runtime → aman.

### Contoh nyata di repo

`packages/components` (Package → pakai peer):

```7:18:packages/components/package.json
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "peerDependencies": {
    "react": "*",
    "react-native": "*",
    "@shopify/flash-list": "<2.0.0"
  }
}
```

`navigations` (package → pakai peer):

```15:21:navigations/package.json
  "peerDependencies": {
    "react": "*",
    "react-native": "*",
    "@react-navigation/native": "*",
    "@react-navigation/native-stack": "*"
  }
}
```

`apps/two` (app → pakai dependencies penuh, "memenuhi" peer di atas):

```13:28:apps/two/package.json
  "dependencies": {
    "@packages/components": "workspace:*",
    "@workspace/navigations": "workspace:*",
    "@workspace/packages/redux": "workspace:*",
    "@react-native/new-app-screen": "0.85.2",
    "@react-navigation/native": "^7.2.2",
    "@react-navigation/native-stack": "^7.14.12",
    "@shopify/flash-list": "2.3.1",
    "hermes-compiler": "250829098.0.10",
    "react": "19.2.3",
    "react-native": "0.85.2",
    "react-native-gesture-handler": "^2.31.1",
    "react-native-safe-area-context": "^5.5.2",
    "react-native-screens": "^4.24.0",
    "react-redux": "^9.2.0"
  },
```

### Checklist singkat

| Lokasi            | `dependencies` | `peerDependencies` | Catatan                                              |
| ----------------- | -------------- | ------------------ | ---------------------------------------------------- |
| `apps/*`          | Ya             | Tidak              | App "memenuhi" peer dan menentukan versi final.      |
| `packages/*`      | Hindari        | Ya                 | Hanya nyatakan kebutuhan, biar app yang menyediakan. |
| `screens/*`       | Hindari        | Ya                 | Sama dengan packages.                                |
| `navigations`     | Hindari        | Ya                 | Sama dengan packages.                                |
| Lib internal lain | `workspace:*`  | atau `peer`        | Boleh pakai keduanya tergantung pola pemakaian.      |

> **Do**: tulis `"react": "*"` di `peerDependencies` package dan tetapkan versi konkret di app.
> **Don't**: copy-paste `react`, `react-native`, dll. ke `dependencies` package — ini sumber duplikasi instance.

---

## 5. Menambahkan Workspace Baru

Langkah umum membuat package internal baru (misal: `packages/utils`):

1. **Buat folder** sesuai kategori: `packages/<nama>`, `screens/<nama>`, dst.
2. **Buat `package.json`** dengan `name` unik. Template minimum:

```json
{
  "name": "@packages/utils",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "react-native": "./src/index.ts",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "react-native": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "peerDependencies": {
    "react": "*",
    "react-native": "*"
  }
}
```

3. **Daftarkan glob** di [pnpm-workspace.yaml](pnpm-workspace.yaml) bila belum tercakup:

```yaml
packages:
  - "apps/*"
  - "screens/*"
  - "packages/*"
  - "navigations"
```

4. **Jalankan `pnpm install`** di root agar pnpm re-link symlink workspace.
5. **Tambahkan ke app** yang akan memakai, contoh di [apps/two/package.json](apps/two/package.json):

```json
 "dependencies": {
   "@packages/utils": "workspace:*"
 }
```

> Catatan: setiap workspace **wajib** punya `package.json` dengan `name`. Tanpa `name`, pnpm akan menolak men-link package dan app yang merefer akan error `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND`.

### 5.1 Kapan `- "packages"` vs `- "packages/*"`

Glob di pnpm berperilaku berbeda. Pahami dulu di mana `package.json` package Anda berada:

| Pola di `pnpm-workspace.yaml` | Yang dianggap package workspace                                                                                      | Kapan dipakai                                          |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `- "packages"`                | Folder `packages/` itu sendiri (`packages/package.json`)                                                             | Saat `packages` adalah **satu package tunggal**        |
| `- "packages/*"`              | Setiap **subfolder langsung** di dalam `packages/` (mis. `packages/auth/package.json`, `packages/main/package.json`) | Saat navigasi **dipecah menjadi beberapa modul**       |
| Keduanya                      | Folder `packages/` + semua subfolder langsungnya                                                                     | Saat ada package "induk" + package pecahan di dalamnya |

Contoh deklarasi keduanya bila Anda memakai dua model sekaligus:

```yaml
packages:
  - "packages"
  - "packages/*"
```

> Repo saat ini memakai `- "packages"` karena `packages/` adalah **satu package tunggal** (`@workspace/packages`). Jika nanti Anda memecahnya menjadi `packages/auth`, `packages/main`, dll., barulah perlu `- "packages/*"`.

---

## 6. Menambahkan App Baru

Karena React Native CLI default belum tahu soal monorepo, ada beberapa langkah penyesuaian setelah `init`. Misal kita ingin membuat app baru bernama `three`:

### Langkah 1 — Init di dalam folder `apps/`

```bash
cd apps
npx @react-native-community/cli@latest init three
```

### Langkah 2 — Bersihkan artefak lokal

CLI akan menjalankan npm install secara default. Hapus dulu agar tidak bentrok dengan pnpm:

```bash
# Bash / macOS / Linux
rm -rf apps/three/node_modules apps/three/package-lock.json

# PowerShell (Windows)
Remove-Item -Recurse -Force apps/three/node_modules, apps/three/package-lock.json
```

### Langkah 3 — Sesuaikan `apps/three/package.json`

- Ubah field `name` menjadi `@app/three`.
- Pertahankan `"private": true`.
- Tambahkan dependency workspace yang dibutuhkan (`@packages/components`, `@workspace/navigations`, dst.) dengan `"workspace:*"`.
- Set `scripts.android` agar memakai port Metro yang **unik** (mis. `--port 8083`) supaya tidak bentrok dengan app lain.

### Langkah 4 — Install ulang dari root

```bash
cd ..        # kembali ke root monorepo
pnpm install
```

### Langkah 5 — Konfigurasi Metro

Salin pola `metro.config.js` dari [apps/two/metro.config.js](apps/two/metro.config.js). Konfigurasi ini memberi tahu Metro untuk:

- Mengamati seluruh workspace (`watchFolders`),
- Mencari modul di `node_modules` lokal app **dan** di root,
- Menonaktifkan hierarchical lookup agar pnpm-style resolution tetap rapi.

```js
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = {
  watchFolders: [workspaceRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, "node_modules"),
      path.resolve(workspaceRoot, "node_modules"),
    ],
    disableHierarchicalLookup: true,
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
```

### Langkah 6 — Konfigurasi Android Gradle

Karena `node_modules` di-hoist ke **root monorepo**, Gradle perlu tahu lokasinya. Patokan path: dari `apps/<app>/android/app/` naik **4 level** untuk mencapai root.

#### `apps/three/android/settings.gradle`

```gradle
pluginManagement { includeBuild("../../../node_modules/@react-native/gradle-plugin") }
plugins { id("com.facebook.react.settings") }
extensions.configure(com.facebook.react.ReactSettingsExtension){ ex -> ex.autolinkLibrariesFromCommand() }
rootProject.name = 'three'
include ':app'
includeBuild('../../../node_modules/@react-native/gradle-plugin')
```

> Path `../../../node_modules/...` di `settings.gradle` naik 3 level karena `settings.gradle` ada di `apps/<app>/android/`.

#### `apps/three/android/app/build.gradle` — blok `react { ... }`

```gradle
react {
    root = file("../..")
    reactNativeDir = file("../../../../node_modules/react-native")
    codegenDir = file("../../../../node_modules/@react-native/codegen")
    cliFile = file("../../../../node_modules/react-native/cli.js")
    hermesCommand = new File(file("$rootDir/../../../node_modules/hermes-compiler/hermesc"), "%OS-BIN%/hermesc").absolutePath
    autolinkLibrariesWithApp()
}
```

> Path `../../../../node_modules/...` naik 4 level karena `build.gradle` ada di `apps/<app>/android/app/`.

Referensi konfigurasi yang sudah jadi: [apps/two/android/settings.gradle](apps/two/android/settings.gradle) dan [apps/two/android/app/build.gradle](apps/two/android/app/build.gradle).

### Langkah 7 — Daftarkan script di root

Tambahkan script di [package.json](package.json) root mengikuti pola yang ada:

```json
"scripts": {
  "three:start": "pnpm --filter @app/three start",
  "three:android": "pnpm --filter @app/three android",
  "three:build": "pnpm --filter @app/three build"
}
```

---

## 7. Menjalankan Project

Semua perintah dijalankan dari **root monorepo**.

| Perintah             | Arti                                                                                    |
| -------------------- | --------------------------------------------------------------------------------------- |
| `pnpm install`       | Install seluruh dependency & link workspace.                                            |
| `pnpm <app>:start`   | Menjalankan Metro bundler app tersebut. Contoh: `pnpm two:start` (default port `8082`). |
| `pnpm <app>:android` | Build & install APK debug ke perangkat/emulator Android.                                |
| `pnpm <app>:build`   | Bundle JS release lalu `gradlew assembleRelease` untuk menghasilkan APK release.        |

Tiap app punya **port Metro** sendiri (lihat `scripts.android` di `apps/<app>/package.json`). Pastikan port unik agar bisa menjalankan dua app sekaligus.

---

## 8. Troubleshooting

`**ERR_PNPM_WORKSPACE_PKG_NOT_FOUND`**
Glob di [pnpm-workspace.yaml](pnpm-workspace.yaml) tidak cocok dengan lokasi `package.json`. Cek bagian [Kapan `- "navigations"` vs `- "navigations/\*"](#51-kapan---navigations-vs---navigations)`. Pastikan juga field `name` di package itu **persis sama\*\* dengan yang ditulis di `dependencies` app.

**Metro: `Unable to resolve module ...`**
Periksa `metro.config.js` app. `watchFolders` harus mencakup `workspaceRoot`, dan `nodeModulesPaths` harus memuat `node_modules` lokal **dan** root. Setelah ubah `metro.config.js`, restart Metro dengan `--reset-cache`.

**Gradle: `Cannot find module 'react-native'` atau plugin `@react-native/gradle-plugin` tidak ditemukan**
Path di `android/settings.gradle` (3 level naik) atau `android/app/build.gradle` (4 level naik) belum benar. Perbaiki seperti contoh di [Langkah 6](#langkah-6--konfigurasi-android-gradle).

**Setelah `pnpm install`, perubahan `package.json` belum terbaca**
Hapus folder `node_modules` di root dan/atau di app yang bermasalah, lalu jalankan ulang `pnpm install`. Tidak perlu menghapus pnpm store.

**Hook React error / `Invalid hook call`**
Indikator kuat ada **dua instance React/RN**. Pastikan packages Anda menempatkan `react` & `react-native` di `peerDependencies` (bukan `dependencies`).

---

## 9. Konvensi Penamaan

| Tipe               | Pola `name`               | Contoh                                                   |
| ------------------ | ------------------------- | -------------------------------------------------------- |
| App                | `@app/<nama>`             | `@app/one`, `@app/two`                                   |
| Package umum       | `@packages/<nama>`        | `@packages/components`                                   |
| Package per area   | `@workspace/<area>`       | `@workspace/navigations`                                 |
| Package bertingkat | `@workspace/<area>/<sub>` | `@workspace/screens/detail`, `@workspace/packages/redux` |

> Ikuti konvensi yang sudah ada di repo agar konsisten dan mudah dicari oleh editor saat auto-import.
