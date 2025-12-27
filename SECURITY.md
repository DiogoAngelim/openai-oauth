# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it privately. Do **not** create a public issue. Instead, email the maintainers or use the security advisory feature on GitHub. We will respond as quickly as possible and coordinate a fix.

- Email: [YOUR-SECURITY-CONTACT@EXAMPLE.COM]
- GitHub Security Advisories: https://github.com/[YOUR-REPO]/security/advisories

## Supported Versions

We only support the latest major version. Please update to the latest release for security patches.

| Version | Supported          |
| ------- | ----------------- |
| latest  | :white_check_mark:|
| <latest | :x:               |

## Security Best Practices

- **Secrets Management:** Store all secrets (API keys, credentials) in GitHub Secrets or a secure secrets manager. Never commit secrets to the repository.
- **Secrets Rotation:** Rotate all secrets regularly. See the checklist below.
- **Dependencies:** Keep dependencies up to date. Automated security audits run in CI/CD.
- **Access Control:** Use the principle of least privilege for all accounts and tokens.
- **CI/CD:** All sensitive values are handled via GitHub Secrets. No secrets are exposed in logs or artifacts.

## Secrets Rotation Checklist

1. Identify all secrets in use (API keys, DB credentials, tokens, etc.).
2. Rotate each secret in its source (cloud provider, database, etc.).
3. Update the new secret in GitHub Secrets or your secrets manager.
4. Remove/disable the old secret.
5. Notify relevant team members of the change.
6. Monitor for any issues after rotation.

## Contact

For any security concerns, please contact the maintainers directly.

---

_This project follows security best practices. For more details, see the CI/CD workflow and documentation._


## Sensitive Data Recovery (Recommended)

While not a current priority, we recommend establishing a sensitive data recovery plan in the future. This should include:

- Automated, encrypted backups of all critical data
- Regular backup verification and restore testing
- Secure access controls for recovery operations
- Clear documentation of recovery procedures and incident response
- Monitoring and alerting for backup failures or data integrity issues

Proactively preparing for data recovery helps ensure resilience and minimizes risk in case of incidents.
