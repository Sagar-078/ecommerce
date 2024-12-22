// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

const nextConfig = {
    images: {
    domains: ["res.cloudinary.com"]
     },
     eslint: {
        ignoreDuringBuilds: true,
      },
  async headers() {

      return [
          {
              source: "/api/:path*",
              headers: [
                  { key: "Access-Control-Allow-Credentials", value: "true" },
                  { key: "Access-Control-Allow-Origin", value: "*" }, 
                  { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                  { key: "Access-Control-Allow-Headers", value: "Content-Type,Authorization" },
                  
              ]
          }
      ]
  }
}

export default nextConfig
