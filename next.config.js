/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/@firebase\/auth\/node_modules\/undici/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            '@babel/plugin-proposal-private-methods',
            '@babel/plugin-proposal-class-properties'
          ]
        }
      }
    });
    return config;
  }
};

module.exports = nextConfig;