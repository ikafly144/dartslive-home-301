import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const tw = tailwindcss();
const twFn = tw.plugins[0];

export default {
  plugins: [
    {
      postcssPlugin: 'tailwind-filtered',
      Once(root, helper) {
        if (helper.result.opts.from && helper.result.opts.from.includes('node_modules')) {
          return;
        }
        return twFn(root, helper.result);
      },
    },
    autoprefixer(),
  ],
};
