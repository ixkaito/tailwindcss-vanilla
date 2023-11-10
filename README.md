# tailwindcss-vanilla

A Tailwind CSS plugin that allows CSS properties to be used in utility classes without modification.

## Example

```html
<div class="border-radius-lg background-color-black padding-8 color-white">
  <h1 class="font-size-2xl">...</h1>
  <p class="line-height-loose">...</p>
</div>
```

## Installation

Install the plugin from npm:

```sh
npm install -D tailwindcss-vanilla
```

Then add the plugin to your `tailwind.config.js` file:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('tailwindcss-vanilla'),
    // ...
  ],
}
```

### Options

By default, core plugins with the same feature are disabled. If you want to enable them, set the `disableCorePlugins` option to `false`.

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('tailwindcss-vanilla')({
      disableCorePlugins: false,
    }),
    // ...
  ],
}
```
