import "./workers/email.worker";
import { emailWorker } from "./workers/email.worker";

console.log("Email Worker Started...");

emailWorker.on("ready", () => {
  console.log("✅ Worker connected to Redis");
});

// emailWorker.on("active", (job) => {
//   console.log(`🚀 Active: ${job.id}`);
// });

// emailWorker.on("completed", (job) => {
//   console.log(`✅ Completed: ${job.id}`);
// });

// emailWorker.on("failed", (job, err) => {
//   console.log(`❌ Failed: ${job?.id}`);
//   console.error(err);
// });

// emailWorker.on("error", (err) => {
//   console.error("Worker Error:", err);
// });

// import { emailQueue } from "../src/queues/email.queue";

// setInterval(async () => {
//   console.log(await emailQueue.getJobCounts());
// }, 5000);