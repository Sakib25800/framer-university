export default {
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "admin",
        "api",
        "storybook",
        "web",
        "chore",
        "docs",
        "packages",
        "apps",
        "ui",
        "config-typescript",
        "config-eslint",
        "logger",
        "ci",
        "build"
      ]
    ],
    "subject-empty": [2, "never"],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"]
  }
};
