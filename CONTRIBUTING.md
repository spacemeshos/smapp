# Contributing to Smapp

First off, thanks for taking the time to contribute!

The following is a set of guidelines for contributing to Smapp, which is hosted in the [Spacemesh Organization](https://github.com/spacemeshos) on GitHub. These are just guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## How Can I Contribute?

### Reporting Bugs

Before reporting a bug, please check our [Github issues](https://github.com/spacemeshos/smapp/issues), [Discord channel](https://discord.com/channels/623195163510046732/691261757921951756), and [Spacemesh Status](https://status.spacemesh.io/) to see if it's a known issue or it's already being worked on. If it's not, you can [open a new issue](https://github.com/spacemeshos/smapp/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=), using a clear and descriptive title.

### Suggesting Enhancements

If you have an idea for a new feature or an enhancement for an existing one, please first check our [Github issues](https://github.com/spacemeshos/smapp/issues) and [Discord channel](https://discord.com/channels/623195163510046732/691261757921951756) to see if it has already been suggested. If not, feel free to [open a new suggestion](https://github.com/spacemeshos/smapp/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=)!

### Good First Issues

If you are new to the project or to open source in general, a great way to get started with contributing to Smapp is by tackling issues labeled as "good first issues". These are relatively small and straightforward issues that have been specifically identified as friendly to newcomers.

Here's how you can get started:

1. Go to the [Issues tab](https://github.com/spacemeshos/smapp/issues) on the Smapp GitHub repository.
2. Filter for issues labeled ["good first issue"](https://github.com/spacemeshos/smapp/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22).
3. Select an issue that you find interesting and feel that you can handle. Don't hesitate to ask questions in the issue comments if something is unclear.
4. Fork the repository, clone it to your local machine, and create a new branch for your work.
5. After you have finished your work, create a Pull Request (PR) to the main repository. Be sure to link to the issue in your PR description.

The goal is to make a meaningful contribution to the project, learn something new, and have fun! If you have any questions or need help, don't hesitate to ask. We're a friendly community and we're always ready to help new contributors.

### Pull Requests

1. Fork the repo and create your branch from `develop` (or `master` if `develop` does not exist).
2. If you've added code that should be tested, add tests.
3. Ensure the test suite passes.
4. Make sure your code lints and follows the established coding standards and conventions.
5. **When opening a pull request, please mark it for project contributors to review**. This will give them the rights to push to the branch and streamline the review process. If you are not able to mark the PR, leave a comment requesting the project contributors' review.

**Note**: Our CI pipeline won't trigger by default if you're not already a project contributor. However, we can trigger it for you upon request. We expect contributions to pass and not break the CI pipeline.

## How to Take an Issue and Start Contributing

If you have decided to contribute (thanks!), here are the steps to take an issue and start contributing:

1. **Pick an Issue**: Look through our [open issues](https://github.com/spacemeshos/smapp/issues). Pick one that interests you and that no one else is already working on.
2. **Check with the Team**: Before starting work on an issue, it is essential to check with the development team. The issue may be outdated or not relevant anymore. You can do this by leaving a comment on the issue asking if it's still valid and waiting for a response before proceeding.
3. **Assign the Issue to Yourself**: If the issue is still relevant, assign it to yourself so that the community knows you're working on it. If you don't have the right to do that, leave a comment stating your intentions to work on it.
4. **Understand the Issue**: Make sure you thoroughly understand the issue. This might involve some communication back and forth with the person who submitted the issue (the reporter) and/or others on the team.
5. **Fork & Clone**: Once the issue is understood, [fork the repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and clone it on your local machine. This will give you a copy of the code to play with locally.
6. **Branch**: Create a new branch in your local clone of the repository. This new branch will contain your solution to the issue.
7. **Code**: Work on the code, ensuring you stick to the coding standards and guidelines defined in this document.
8. **Test**: Make sure you add appropriate tests and ensure all the existing tests pass.
9. **Commit & Push**: Commit your changes with a clear, descriptive commit message. Push the changes to your repository.
10. **Pull Request**: [Create a pull request](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request) on the official repository, proposing to merge your new branch (in your fork) with the main branch of the official repository.
11. **Review & Iterate**: Maintainers of the repository will review your pull request. They may suggest changes or improvements. This is part of the process, and it is common to iterate on your solution before it gets merged.

Remember, contributions are not limited to code. You can help with documentation, testing, translation, or any other aspect that you think will benefit the project!

## Coding Standards and Conventions

Please ensure that your contributions adhere to the coding standards and conventions used in the Smapp project. This includes proper indentation, accurate comments, and following naming conventions. If the project includes a linter or formatter config (like .editorconfig, .eslintrc, .prettierrc), please make sure your contributions do not violate the rules.

## Setting Up the Development Environment

Before you can start contributing to Smapp, you'll need to set up a development environment on your local machine. You can find instructions on how to do this in the [README.md](https://github.com/spacemeshos/smapp/blob/develop/README.md) file of the Smapp repository.

## Commit Messages

Good commit messages serve at least three important purposes:

- Speeding up the reviewing process.
- Helping us write a good release note.
- Providing context for the change for future reference.

Read [this](https://www.freecodecamp.org/news/writing-good-commit-messages-a-practical-guide/) practical guide for writing good commit messages.

Please note that the Smapp project is released with a [Contributor Code of Conduct](https://github.com/spacemeshos/smapp/blob/develop/CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.
