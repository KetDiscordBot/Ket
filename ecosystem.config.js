module.exports = {
    apps: [{
        name: "ket",
        script: "dist/index.js",
        args: "--expose-gc --trace-warnings --no-menu",
        max_memory_restart: "384M",
        instances: 1,
        exec_mode: "fork",
        merge_logs: true,
        out_file: "./src/logs/output.log",
        error_file: "./src/logs/errors.log"
    }]
}