import type { NextConfig } from "next";

const wooProxyTarget =
  process.env.WOO_PROXY_TARGET ??
  process.env.WOO_BASE_URL ??
  process.env.NEXT_PUBLIC_WP_URL;
const normalizedWooProxyTarget = wooProxyTarget?.replace(/\/$/, "");
const wooAdminUrl = normalizedWooProxyTarget
  ? `${normalizedWooProxyTarget}/wp-admin/`
  : "http://chantdumerle-wp.test/wp-admin/";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "chantdumerle.test"],
  images: {
    // Le WordPress local sert les images via chantdumerle-wp.test -> 127.0.0.1.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: wooAdminUrl,
        permanent: false,
      },
      {
        source: "/fr/panier",
        destination: "/panier",
        permanent: true,
      },
      {
        source: "/mon-compte",
        destination: "/fr/mon-compte",
        permanent: true,
      },
      {
        source: "/selections",
        destination: "/fr/selections",
        permanent: true,
      },
      {
        source: "/selections/:kind/:slug",
        destination: "/fr/selections/:kind/:slug",
        permanent: true,
      },
      {
        source: "/produit/:slug",
        destination: "/fr/produits/:slug",
        permanent: true,
      },
      {
        source: "/product/:slug",
        destination: "/fr/produits/:slug",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    if (!normalizedWooProxyTarget) {
      return [];
    }

    /*
     * Woo owns cart, checkout, account, REST and media. Proxying these paths
     * under the storefront domain lets Woo set the cookies used by checkout.
     */
    return [
      {
        source: "/",
        has: [
          {
            type: "query",
            key: "wc-ajax",
            value: "(?<endpoint>.*)",
          },
        ],
        destination: `${normalizedWooProxyTarget}/?wc-ajax=:endpoint`,
      },
      {
        source: "/wp-json/:path*",
        destination: `${normalizedWooProxyTarget}/wp-json/:path*`,
      },
      {
        source: "/wp-admin/admin-ajax.php",
        destination: `${normalizedWooProxyTarget}/wp-admin/admin-ajax.php`,
      },
      {
        source: "/wp-login.php",
        destination: `${normalizedWooProxyTarget}/wp-login.php`,
      },
      {
        source: "/wp-content/:path*",
        destination: `${normalizedWooProxyTarget}/wp-content/:path*`,
      },
      {
        source: "/panier/:path*",
        destination: `${normalizedWooProxyTarget}/panier/:path*`,
      },
      {
        source: "/commande/:path*",
        destination: `${normalizedWooProxyTarget}/commande/:path*`,
      },
      {
        source: "/mon-compte/:path*",
        destination: `${normalizedWooProxyTarget}/mon-compte/:path*`,
      },
    ];
  },
};

export default nextConfig;
