# Workspace Configuration

## Git Integration
repo: https://github.com/chunhualiao/openclaw-paradigm-book.git
branch: main
auto_commit: true
auto_push: true
commit_on: subagent_completion

## New Repo Defaults
default_visibility: private
owner: chunhualiao
gh_cli: true

## Commit Strategy
batch_commits: false
commit_message_template: |
  {action} by {agent}
  
  {details}

## Ignored Paths
ignore:
  - "*.tmp"
  - ".DS_Store"
  - "scratch/"
  - "node_modules/"
