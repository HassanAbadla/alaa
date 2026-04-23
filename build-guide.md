# PMIS/GRC Build Guide

## Initial Setup
1. Clone the repository
2. Install dependencies:
```bash
npm install
npm install --save-dev cross-env
npm install nuxt@2  # Ensure Nuxt 2 is installed
```

## Environment Files
Create two files in your project root:

`.env.default`
```
BUILD_TARGET=default
PMWEB_API_KEY=your_key_here
```

`.env.zain`
```
BUILD_TARGET=zain
PMWEB_API_KEY=your_key_here
```

## Running Locally

```bash
# For PMIS version:
npm run dev:default

# For Zain GRC version:
npm run dev:zain
```

## Building for Production

```bash
# Build both versions (creates zip files with timestamps):
npm run build-all

# Or build individually:
npm run build:default  # For PMIS
npm run build:zain    # For Zain GRC
```

## Using isZain in Components

```vue
<template>
  <div>
    <!-- Simple if/else -->
    <h1 v-if="isZain">Zain GRC Platform</h1>
    <h1 v-else>PMIS</h1>

    <!-- With props -->
    <logo-component :src="isZain ? '/zain-logo.png' : '/pmis-logo.png'" />
  </div>
</template>

<script>
export default {
  computed: {
    isZain() {
      return process.env.isZain
    }
  }
}
</script>
```

## Troubleshooting

If you get any errors:
1. Make sure you've completed all installation steps above
2. Make sure both .env files exist
3. Try resetting your installation:
```bash
rm -rf node_modules
npm cache clean --force
npm install
npm install --save-dev cross-env
npm install nuxt@2
```

## Notes
- The app will automatically redirect '/' and '/pmis' to '/grc' in the Zain build
- Always test your changes in both builds
