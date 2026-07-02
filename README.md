# volto-cca-policy

[![Releases](https://img.shields.io/github/v/release/eea/volto-cca-policy)](https://github.com/eea/volto-cca-policy/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-cca-policy%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-cca-policy/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-cca-policy&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-cca-policy)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-cca-policy&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-cca-policy)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-cca-policy&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-cca-policy)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-cca-policy&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-cca-policy)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-cca-policy%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-cca-policy/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-cca-policy&branch=develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-cca-policy&branch=develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-cca-policy&branch=develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-cca-policy&branch=develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-cca-policy&branch=develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-cca-policy&branch=develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-cca-policy&branch=develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-cca-policy&branch=develop)

Climate-ADAPT Frontend Policy 

[Volto](https://github.com/plone/volto) add-on

## Release

See [RELEASE.md](https://github.com/eea/volto-cca-policy/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-cca-policy/blob/master/DEVELOP.md).

## Secret Scanning

This repository uses the Betterleaks GitHub Action to scan the current
repository content on every push and pull request. The scan uses the rules in
`.gitleaks.toml` and uploads a `betterleaks-report` artifact when a finding is
detected.

There are three common outcomes:

1. **Everything is OK.** The `Betterleaks / Scan for secrets` check is green and
   no action is needed. Regular references to runtime values are OK, for example:

   ```js
   const tokenFromCookie = req.universalCookies.get('auth_token');
   ```

2. **A real secret was found.** The check is red and the workflow log asks you to
   download the `betterleaks-report` artifact. Open the artifact from the GitHub
   Actions run and check the reported file, line and rule. Remove the committed
   value, move it to the proper secret store, and rotate it if it was exposed.
   A report entry looks like this:

   ```json
   {
     "RuleID": "secret-literal-assignment",
     "File": "src/config.js",
     "StartLine": 12,
     "Secret": "[REDACTED]"
   }
   ```

3. **The finding is a false positive.** Keep the value only if it is clearly not
   sensitive, such as a test fixture, placeholder, or public example. Add
   `betterleaks:allow` on the same line and include a short explanation in the
   pull request.

   ```js
   const testPassword = 'admin'; //betterleaks:allow
   ```

   ```yaml
   password: "admin" #betterleaks:allow
   ```

Do not add `betterleaks:allow` to real credentials.

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-cca-policy/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
don-template/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
