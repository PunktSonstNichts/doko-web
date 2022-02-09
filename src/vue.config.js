module.exports = {
    runtimeCompiler: true,
    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/style/colors.scss";`
            }
        }
    }
}