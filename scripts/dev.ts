const processes = [
  Bun.spawn(["bun", "--watch", "server/index.ts"], {
    stdout: "inherit",
    stderr: "inherit",
  }),
  Bun.spawn(["./node_modules/.bin/vite", "--host", "0.0.0.0", "--port", "5174", "--strictPort"], {
    stdout: "inherit",
    stderr: "inherit",
  }),
];

async function shutdown() {
  for (const child of processes) {
    if (!child.killed) {
      child.kill();
    }
  }

  await Promise.allSettled(processes.map((child) => child.exited));
}

process.on("SIGINT", () => {
  void shutdown().finally(() => process.exit(0));
});

process.on("SIGTERM", () => {
  void shutdown().finally(() => process.exit(0));
});

await Promise.race(processes.map((child) => child.exited));
await shutdown();

export {};
