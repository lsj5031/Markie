# Contributing to Markie

Thank you for your interest in contributing to Markie! We welcome all contributions, from bug reports and feature requests to code improvements and documentation updates.

## How to Contribute

1. **Bug Reports**: If you find a bug, please open an issue with a clear description, steps to reproduce, and your environment details.
2. **Feature Requests**: Have an idea? Open an issue to discuss it before you start writing code. This helps ensure that your contribution aligns with the project's goals.
3. **Pull Requests**:
   - Fork the repository and create a new branch.
   - Ensure your code follows the existing style and conventions.
   - Write tests for your changes, if applicable.
   - Run the full test suite (`npm test`) and linter (`npx oxlint`) before submitting.
   - Submit your pull request with a descriptive title and detailed explanation of your changes.

## Development Setup

To set up the project locally:

```bash
# Clone your fork
git clone https://github.com/your-username/Markie.git
cd Markie

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Quality Assurance

Before submitting a PR, make sure your code passes all checks:

- **Linting**: We use Oxlint. Run `npx oxlint` and fix any warnings or errors.
- **Testing**: Playwright is used for end-to-end tests. Run `npm test`.
- **Formatting**: We use standard Prettier rules. Run `npm run format` if you have a formatting script.

Please be kind and respectful when interacting with the community. We look forward to your contributions!
