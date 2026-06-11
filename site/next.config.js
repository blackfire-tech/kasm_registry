/**
 * Blackfire Kasm Workspaces registry — site config.
 *
 * The `env` block here is what brands the registry: the values are baked into
 * the generated `list.json` that Kasm Workspaces reads (registry name, icon,
 * description and contact link). Drop your Blackfire logo at
 * `site/public/img/blackfire-logo.png` (referenced by `icon` below).
 *
 * `basePath` must be `/<repo-name>/<schema-version>`. The build replaces the
 * `1.0` segment with the branch name automatically, so keep it as `1.0` here.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    name: 'Blackfire',
    description:
      "Blackfire's Kasm Workspaces registry — privacy-first apps and custom workspaces.",
    icon: '/img/blackfire-logo.png',
    listUrl: 'https://blackfire-tech.github.io/kasm_registry/',
    contactUrl: 'https://blackfire.tech',
  },
  basePath: '/kasm_registry/1.0',
}

module.exports = nextConfig
