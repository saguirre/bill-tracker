/** @type {import('next').NextConfig} */
const { withAxiom } = require('next-axiom');

module.exports = withAxiom({
  reactStrictMode: true,
  crossOrigin: 'anonymous',
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
});
