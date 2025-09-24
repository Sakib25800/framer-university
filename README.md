<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/fu-logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="assets/fu-logo-light.png">
    <img alt="Framer University logo" src="assets/fu-logo-dark.png" width="150">
  </picture>
</div>

<div align="center">
  <h1>Framer University</h1>
</div>

<div align="center">
  <p>Learn everything there is to know about Framer</p>
</div>

## Loader component

Assets expected in `public/`:

- `universal-loader-mask.png` (mask image for the logo, white on transparent)
- `universal-loader-video.mp4` (looping background video)

Usage:

```tsx
import { Loader } from "@/components/Loader/Loader";

export default function Example() {
  return (
    <div className="flex h-64 items-center justify-center bg-black">
      <Loader size={56} />
    </div>
  );
}
```

Notes:

- The mask + video effect uses CSS `mask-image` so it only shows in browsers that support CSS masks (modern Chromium/Safari). It gracefully shows the full video rectangle if masks aren’t supported.
- The logo bobs up 20px and back down using keyframes that mirror the Framer variants.
- Adjust speed/easing by overriding the `animate-fu-loader-bob` utility in `styles/tailwind.css`.
