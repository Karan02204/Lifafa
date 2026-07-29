import { emailQueue } from "./queues/email.queue";

const job = await emailQueue.getJob("7");

console.log({
  state: await job?.getState(),
  delay: job?.delay,
  timestamp: job?.timestamp,
  processedOn: job?.processedOn,
  finishedOn: job?.finishedOn,
});
