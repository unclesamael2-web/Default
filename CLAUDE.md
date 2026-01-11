# CLAUDE.md - AI Assistant Guide

This document provides comprehensive guidance for AI assistants working with this codebase. It explains the project structure, development workflows, conventions, and best practices.

## Repository Overview

**Repository:** unclesamael2-web/Default
**Current Branch:** `claude/claude-md-mk8wxtanhw9zmsel-s573o`
**Status:** Active development repository

### Purpose
This repository serves as a development workspace. As the project evolves, this section should be updated with:
- Project goals and objectives
- Technology stack
- Target deployment environment
- Key dependencies

## Codebase Structure

### Directory Organization
```
/
├── src/                 # Source code (to be created)
├── tests/              # Test files (to be created)
├── docs/               # Documentation (to be created)
├── config/             # Configuration files (to be created)
└── scripts/            # Build and utility scripts (to be created)
```

**Note:** As the project structure develops, update this section with actual directories and their purposes.

### File Naming Conventions
- Use lowercase with hyphens for directories: `my-component/`
- Use appropriate extensions: `.js`, `.ts`, `.py`, `.md`, etc.
- Keep names descriptive but concise
- Avoid special characters except hyphens and underscores

## Development Workflows

### Branch Strategy

**Claude Development Branches:**
- All AI assistant work should be done on branches prefixed with `claude/`
- Branch naming pattern: `claude/claude-md-<session-id>`
- Current working branch: `claude/claude-md-mk8wxtanhw9zmsel-s573o`

**Important Rules:**
1. NEVER push directly to `main` or `master` branches
2. Always develop on the designated Claude branch
3. Create pull requests for merging changes to main branches
4. Branch names must start with `claude/` for push authorization

### Git Operations

#### Committing Changes
```bash
# Stage changes
git add <files>

# Commit with descriptive message
git commit -m "Brief description of changes"

# Push to origin with upstream tracking
git push -u origin <branch-name>
```

**Commit Message Guidelines:**
- Use imperative mood: "Add feature" not "Added feature"
- Be concise but descriptive
- First line: summary (50 chars max)
- Blank line, then detailed explanation if needed
- Reference issues/tickets when applicable

#### Retry Logic for Network Operations
- For `git push`: Retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s)
- For `git fetch/pull`: Same retry pattern
- Only retry on network errors, not authentication failures

Example:
```bash
git push -u origin claude/branch-name || \
  (sleep 2 && git push -u origin claude/branch-name) || \
  (sleep 4 && git push -u origin claude/branch-name) || \
  (sleep 8 && git push -u origin claude/branch-name)
```

### Pull Request Workflow

1. **Before Creating PR:**
   - Ensure all tests pass
   - Run linters and formatters
   - Update documentation if needed
   - Review your own changes

2. **Creating PR:**
   ```bash
   # Ensure branch is up to date
   git fetch origin main
   git rebase origin/main

   # Push changes
   git push -u origin <branch-name>

   # Create PR using GitHub CLI
   gh pr create --title "Brief description" --body "Detailed description"
   ```

3. **PR Description Template:**
   ```markdown
   ## Summary
   - Brief overview of changes
   - Why these changes were made

   ## Changes
   - Detailed list of modifications
   - Files affected

   ## Testing
   - How changes were tested
   - Test results

   ## Additional Notes
   - Any caveats or considerations
   ```

## Key Conventions for AI Assistants

### Code Quality Standards

1. **Security First**
   - NEVER commit sensitive data (API keys, passwords, tokens)
   - Avoid security vulnerabilities: XSS, SQL injection, command injection, etc.
   - Validate user input at system boundaries
   - Use parameterized queries for databases
   - Sanitize outputs that render in browsers

2. **Simplicity Over Complexity**
   - Don't over-engineer solutions
   - Only add features explicitly requested
   - Avoid premature optimization
   - Keep abstractions minimal
   - Three similar lines are better than premature abstraction

3. **Code Changes**
   - ALWAYS read files before modifying them
   - Only change what's necessary for the task
   - Don't refactor unrelated code
   - Don't add comments/docs to unchanged code
   - Remove unused code completely (no `_unused` hacks)

4. **Error Handling**
   - Only add error handling at system boundaries
   - Trust internal code and framework guarantees
   - Don't handle scenarios that can't happen
   - Let errors propagate when appropriate

### File Operations Best Practices

1. **Reading Files**
   - Use Read tool, not `cat` commands
   - Read entire files unless they're very large
   - Check file exists before attempting complex operations

2. **Editing Files**
   - Use Edit tool for modifications, not `sed/awk`
   - Preserve exact indentation from source
   - Make targeted, specific changes
   - Verify edits after completion

3. **Creating Files**
   - Use Write tool, not `echo` or heredocs
   - ONLY create files when absolutely necessary
   - ALWAYS prefer editing existing files
   - Don't create documentation files unless requested

### Communication Guidelines

1. **With Users:**
   - Be concise and technical
   - Avoid emojis unless requested
   - Use markdown for formatting
   - Include file paths with line numbers: `file.ts:123`
   - Never use bash commands to communicate

2. **Tool Usage:**
   - Use specialized tools over bash commands
   - Run independent operations in parallel
   - Chain dependent operations sequentially
   - Don't guess or use placeholders for parameters

3. **Task Management:**
   - Use TodoWrite for multi-step tasks
   - Mark tasks in progress before starting
   - Complete tasks immediately when done
   - Keep todo list current and accurate

## Testing Practices

### Before Committing
- Run all relevant tests
- Ensure build succeeds
- Check for linting errors
- Verify functionality manually if appropriate

### Test Naming
- Use descriptive test names
- Follow project's testing framework conventions
- Group related tests logically

### Coverage
- Aim for meaningful coverage, not 100%
- Test edge cases and error paths
- Don't test framework functionality

## Code Review Checklist

When reviewing changes (your own or others):

- [ ] Code solves the stated problem
- [ ] No security vulnerabilities introduced
- [ ] No sensitive data committed
- [ ] Tests pass and cover new functionality
- [ ] Code is simple and maintainable
- [ ] No unnecessary complexity added
- [ ] Documentation updated if needed
- [ ] Follows project conventions
- [ ] No console.log/debugging code left
- [ ] Error handling is appropriate

## Common Commands

### Development
```bash
# Check repository status
git status

# View recent changes
git diff

# View commit history
git log --oneline -10

# Create new branch
git checkout -b claude/new-feature-name
```

### Testing
```bash
# Run tests (update with actual commands)
npm test          # for Node.js
pytest           # for Python
cargo test       # for Rust
```

### Building
```bash
# Build project (update with actual commands)
npm run build    # for Node.js
python setup.py build  # for Python
cargo build      # for Rust
```

## Project-Specific Guidelines

### Technology Stack
*To be updated as project develops*

### Dependencies
*To be updated as dependencies are added*

### Environment Setup
*To be updated with setup instructions*

### Deployment
*To be updated with deployment procedures*

## Troubleshooting

### Common Issues

1. **Push fails with 403 error**
   - Ensure branch name starts with `claude/`
   - Verify branch name ends with correct session ID
   - Check network connectivity

2. **Merge conflicts**
   - Fetch latest changes: `git fetch origin`
   - Rebase on target branch: `git rebase origin/main`
   - Resolve conflicts manually
   - Continue rebase: `git rebase --continue`

3. **Tests failing**
   - Check if changes broke existing functionality
   - Review test output carefully
   - Verify test environment is correct
   - Don't mark tasks complete if tests fail

## Maintenance

### Keeping CLAUDE.md Updated

This file should be updated when:
- Project structure changes significantly
- New conventions are established
- Technology stack is modified
- Development workflows change
- New tools or frameworks are added

### Version History
- **2026-01-10**: Initial creation for new repository

---

## Quick Reference

### Essential Git Commands
```bash
git status                          # Check current state
git add <file>                      # Stage changes
git commit -m "message"             # Commit changes
git push -u origin <branch>         # Push to remote
git fetch origin <branch>           # Fetch updates
git rebase origin/main              # Rebase on main
```

### File Operations
- Read: Use Read tool
- Edit: Use Edit tool
- Create: Use Write tool (sparingly)
- Search: Use Grep tool
- Find: Use Glob tool

### When to Use Task Tool
- Exploring codebase structure
- Multi-step research tasks
- Complex searches across many files
- Planning implementation strategies

---

**Last Updated:** 2026-01-10
**Maintained By:** AI assistants working with this repository
**Review Frequency:** Update as project evolves
