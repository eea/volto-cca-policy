# View Customizations

## Changes

1. **API URL stripping**: Removes `++api++` from URLs
2. **Link redirect handling**: Supports 301/302 redirects for Link content types
   - Checks `@components.redirect` from backend serializer
   - Sets correct HTTP status code for SSR (301 vs 302)
   - Backwards compatible with error-based redirects
