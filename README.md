# Build complete company design system

Credits: This is the code along of course [Build a Complete Company Design System](https://www.newline.co/courses/build-a-complete-company-design-system), but instead of cloning the repo I build it from scratch to use  
latest dependencies instead of the fixed version used by author and a better understanding of the architecture.

## Tech Stack:

- [React](https://beta.reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Yarn workspaces](https://yarnpkg.com/)
- [Style Dictionary](https://amzn.github.io/style-dictionary/#/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [styled-components](https://styled-components.com/)
- [Axe](https://www.deque.com/axe/)
- [Storybook](https://storybook.js.org/)
- [GitHub Actions](https://github.com/features/actions)

### Monorepo

3 packages:

- Foundation: host and distribute our design tokens and assets
- React: demo components [Button](packages/react/src/Button.tsx), [IconButton](packages/react/src/IconButton.tsx) flexible enough and will be styled with our generated design-system styles tokens
- Storybook: lay out the best practices for developing/documenting components with Typescript

## Take away from course

The flow goes from a design document [figma](https://www.figma.com/), [sketch](https://www.sketch.com/), [Adobe xd](https://helpx.adobe.com/support/xd.html)(source of truth) then extract `design tokens` into a platform agnotic `json` files

    foundation/
    ├─ src/
    │  ├─ tokens/
    │  │  ├─ animations.json
    │  │  ├─ color.json
    │  │  ├─ radius.json
    │  │  ├─ shadows.json
    │  │  ├─ spacings.json

Then use `style-dictionary cli` to create platform specific assets: scss/css var js-style-objects, for doing that a
[style-dictionary config file](packages/foundation/sd.config.js)

<details>
  <summary>style dictionary config file(sd.config.js)</summary>
  <pre>
module.exports = {
  source: ['src/tokens/**/*.json'],
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: 'lib/tokens/scss/',
      files: [
        {
          destination: 'tokens.scss',
          format: 'scss/variables',
        },
      ],
    },
    css: {
      transformGroup: 'css',
      buildPath: 'lib/tokens/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
        },
      ],
    },
    'js-src': {
      transformGroup: 'js',
      buildPath: 'src/tokens/js/',
      files: [
        {
          name: 'tokens',
          destination: 'tokens.js',
          format: 'javascript/module',
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'lib/tokens/js/',
      files: [
        {
          name: 'tokens',
          destination: 'tokens.js',
          format: 'javascript/module',
        },
      ],
    },
  },
};
</pre>
</details>

To generate assets, first define a [package script](packages/foundation/package.json)

```json
  "scripts": {
    "build-tokens": "style-dictionary build --config sd.config.js",
    "build": "yarn build-tokens && tsc",
    "build-tsc": "tsc --skipLibCheck"
  },
```

Having that just run command:

```bash
$ yarn workspace @renato1010/foundation build
```

👆️ That command will generate assets in `./lib` folder

Finally, to facilitate the consumption of the assets, we need to make some changes to [package.json](packages/foundation/package.json) and [src/index.ts](packages/foundation/src/index.ts)

<details>
  <summary>package.json entry point and types</summary>
  <pre>
  {
  "name": "@renato1010/foundation",
  "packageManager": "yarn@3.3.1",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",

  </pre>
</details>
<details>
  <summary>index.ts: entry point</summary>
  <pre>
import tokens from './tokens/js/tokens';

export { tokens };

  </pre>
</details>

<br>

## Consumption of tokens in React components

Having `tokens` as export from `foundation` package, it's really easy to style our React components

```ts
import { forwardRef } from 'react';
import styled from 'styled-components';
import { tokens } from '@renato1010/foundation';

type ButtonProps = JSX.IntrinsicElements['button'] & {
  /** Color based on the color props */
  color: keyof typeof tokens.colors;
  /** if button is in disabled state */
  disabled?: boolean;
  /** loading state */
  loading?: boolean;
};

const ButtonStyled = styled.button<ButtonProps>`
  /* Static styles */
  all: unset;
  cursor: pointer;
  padding: 8px 20px;
  &:disabled {
    opacity: 40%;
  }
  /* Inherit from design tokens */
  transition: ${tokens.animations.default.value};
  color: ${tokens.colors.neutral.white.value};
  border-radius: ${tokens.radius.large.value};
  background-color: ${(props) => tokens.colors[props.color][500].value};
  &:hover {
    background-color: ${(props) => tokens.colors[props.color][700].value};
  }
  &:active {
    background-color: ${(props) => tokens.colors[props.color][800].value};
  }
`;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ disabled, loading, color = 'primary', ...rest }, ref) => {
    return <ButtonStyled {...rest} ref={ref} color={color} disabled={disabled || loading} />;
  }
);
```

## Use Storybook to render React components in isolation

Create a story to visualize component variations and verify appearance and behavior
[Button.stories.tsx](packages/storybook/stories/Button.stories.tsx)

```tsx
import { Button } from '@renato1010/react/src/Button';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'renato1010/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Default text',
};
```

run command:

```bash
$ yarn workspace @renato1010/storybook storybook
```

Got this: 👇️

![storybook display](https://losormorpino-public-media.s3.us-east-2.amazonaws.com/c300tuy.png)

## Enforce Accessibility rules

Throughout the project, a11and standards were applied to ensure compliance.  
Linting plugin [.eslintrc.js](.eslintrc.js)

<pre>
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    <mark>'plugin:jsx-a11y/recommended'</mark>,
    'plugin:prettier/recommended',
  ],
</pre>

With Storybook: [storybook config file](packages/storybook/.storybook/main.js)

<pre>
  module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    <mark>'@storybook/addon-a11y'</mark>,
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  docs: {
    autodocs: true,
  },
  core: {
    builder: 'webpack5',
  },
};
</pre>

Testing with with **Jest**, custom matcher for a11y
use lib: [jest-axe](https://www.npmjs.com/package/jest-axe)

<details>
  <summary>IconButton test for accessibility(a11y)</summary>
  <pre>
import React from 'react';
import { IconButton } from '../src/IconButton';
import { render, fireEvent, screen } from '@testing-library/react';
<mark>import { axe, toHaveNoViolations } from 'jest-axe'</mark>;
import '@testing-library/jest-dom';

<mark>expect.extend(toHaveNoViolations)</mark>;

test('tests icon button render and click callback', async () => {
const handleClick = jest.fn();

const { container } = render(
<IconButton onClick={handleClick} aria-label="icon button">
<svg
xmlns="http://www.w3.org/2000/svg"
fill="none"
viewBox="0 0 24 24"
strokeWidth="1.5"
stroke="currentColor"
style={{ width: '1em', height: '1em' }} >
<path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
        />
</svg>
</IconButton>
);
<mark display="inline">
const results = await axe(container);
expect(results).toHaveNoViolations();
</mark>

fireEvent.click(screen.getByRole('button'));

expect(handleClick).toHaveBeenCalledTimes(1);
});

  </pre>
</details>

<br>

**\*The steps related to package deployment were not taken into account because it was not my purpose**
