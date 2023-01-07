const hello = (name?: string) => `${name || "World"}`;

const user = {
  jobTitle: 'bug'
};
if((user.jobTitle = 'junior')) {
  user.jobTitle = 'Bug'
}

export { hello };
