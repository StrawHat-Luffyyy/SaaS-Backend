export const queueJob = async (jobName, payload) => {
  setTimeout(() => {
    console.log(`Job executed: ${jobName}`, payload);
  }, 0);
};
