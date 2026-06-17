module.exports = {
  types: [
    { value: "feat", name: "feat:     A new feature" },
    { value: "fix", name: "fix:      A bug fix" },
    { value: "docs", name: "docs:     Documentation only changes" },
    {
      value: "style",
      name: "style:    Changes that do not affect the meaning of the code"
    },
    {
      value: "refactor",
      name: "refactor: A code change that neither fixes a bug nor adds a feature"
    },
    {
      value: "perf",
      name: "perf:     A code change that improves performance"
    },
    {
      value: "test",
      name: "test:     Adding missing tests or correcting existing tests"
    },
    {
      value: "chore",
      name: "chore:    Changes to the build process or auxiliary tools"
    },
    { value: "revert", name: "revert:   Revert to a previous commit" }
  ],

  // Matches your commitlint.config.cjs scopes exactly
  scopes: [
    { name: "repo" },
    { name: "shared" },
    { name: "pes-files-fetch" },
    { name: "gemini-auto-temp" }
  ],

  usePreparedCommit: false,
  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberRegExp: "\\d{1,5}",

  // Override prompt messages
  messages: {
    type: "Select the type of change that you're committing:",
    scope: "\nDenote the SCOPE of this change (required):",
    subject: "Write a SHORT, IMPERATIVE tense description of the change:\n",
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new lines:\n',
    breaking: "List any BREAKING CHANGES (optional):\n",
    footer:
      "List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n",
    confirmCommit: "Are you sure you want to proceed with the commit above?"
  },

  allowBreakingChanges: ["feat", "fix"],
  subjectLimit: 100
};
