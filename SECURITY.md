# Security Policy

## Supported versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a vulnerability

Please report security issues to **bizykov@gmail.com** (do not use public issues).  
We will respond within 48 hours and release a fix as soon as possible.

## Security best practices

- JWT tokens with short expiration
- Input validation via class-validator
- Environment variables for secrets (never hardcoded)
- Regular dependency updates via Dependabot