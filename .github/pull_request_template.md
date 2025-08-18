## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Test coverage improvement

## SSOT Compliance Checklist
**Required if `docs/SSOT.md` was modified:**
- [ ] Version/date header incremented in `docs/SSOT.md`
- [ ] `SHORT_PROMPT.md` updated if Section 1 (Short System Prompt) changed
- [ ] SSOT owner field is current and accurate
- [ ] Both files committed in same PR
- [ ] CI validation passes (`tools/validate-ssot.js`)

## Testing Checklist
- [ ] Unit tests pass (`npm run test:unit`)
- [ ] Integration tests pass (`npm run test:integration`) 
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] All validators pass (`npm run validate`)
- [ ] Manual testing completed for affected functionality

## API Contract Compliance
**Required if API endpoints were added/modified:**
- [ ] `API_CONTRACTS.md` updated with new endpoints/changes
- [ ] Error responses follow standard `{ error: { code, message, details? } }` format
- [ ] Request/response schemas documented
- [ ] Acceptance tests added for contract validation

## Workspace Rules Compliance
- [ ] New files follow naming conventions (kebab-case scripts, PascalCase components)
- [ ] No prohibited directories added (`lib/`, `vendor/`, etc.)
- [ ] No files >1MB committed (use external storage if needed)
- [ ] Workspace structure validator passes (`npm run validate:workspace`)

## Documentation Updates
- [ ] README.md updated if user-facing changes
- [ ] TECH_STACK.md updated if technology/architecture changes
- [ ] API documentation updated if endpoints changed
- [ ] Migration notes added if breaking changes

## Security Considerations
- [ ] No secrets or credentials committed
- [ ] Environment variables properly configured
- [ ] Input validation added for new endpoints
- [ ] Authentication/authorization requirements met

## Performance Impact
- [ ] Performance impact assessed (if applicable)
- [ ] Bundle size impact minimal (if frontend changes)
- [ ] Database queries optimized (if applicable)
- [ ] Caching strategy considered (if applicable)

## Deployment Notes
<!-- Any special deployment instructions, environment variable changes, or migration steps -->

## Related Issues
<!-- Link any related GitHub issues or tickets -->
- Closes #
- Related to #

---

### Review Checklist for Reviewers
- [ ] Code follows project conventions and style guidelines
- [ ] Changes are well-tested with appropriate coverage
- [ ] Documentation is accurate and complete
- [ ] SSOT compliance verified (if applicable)
- [ ] API contracts validated (if applicable)
- [ ] Security implications reviewed
