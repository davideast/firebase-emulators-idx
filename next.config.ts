import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // async headers() {
  //   return [
  //     {
  //       source: '/',
  //       headers: [
  //         { key: 'Access-Control-Allow-Origin', value: '*' },
  //         { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS,PUT,DELETE' },
  //         { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
  //       ],
  //     },
  //   ];
  // },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'http://127.0.0.1:9099/:path*',
      },
      // Add other rules if needed
      {
        source: '/v1beta/projects/:path*',
        destination: 'http://127.0.0.1:9399/v1beta/projects/:path*'
      },
      {
        source: '/google.firestore.v1.Firestore/:path*',
        destination: 'http://127.0.0.1:8080/google.firestore.v1.Firestore/:path*'
      }
    ];
  },
};

// http://8080-idx-proxy-1743706152315.cluster-22qpi2wzsjc4utjzyqn2yu6ar6.cloudworkstations.dev/google.firestore.v1.Firestore/Listen/channel?VER=8&database=projects%2Fgenkit-idx%2Fdatabases%2F(default)&RID=85568&CVER=22&X-HTTP-Session-Id=gsessionid&zx=z7zgs3auedge&t=1

export default nextConfig;
