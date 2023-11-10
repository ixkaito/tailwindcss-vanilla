# tailwindcss-vanilla

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

## Usage

```html
<p class="font-size-4 ...">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
```
