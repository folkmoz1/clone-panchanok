
module.exports = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        })

        return config
    },
    images: {
        domains: ['res.cloudinary.com']
    },
    env: {
        WS_URI: process.env.WS_URI,
        BACKEND_URI: process.env.BACKEND_URI,
        NEXT_PUBLIC_WEBSITE_URI: process.env.NEXT_PUBLIC_WEBSITE_URI
    },
}
