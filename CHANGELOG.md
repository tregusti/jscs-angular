# v1.2.2 (2016-02-20)

- Fix: `angularVerifyDependencyUsage` uses the variable name and not the name of the dependency
  specified in the array syntax. #24.

# v1.2.1 (2015-07-30)

- Support JSCS v1.8 plugin architecture. #20.
- Support JSCS v2.x. #22.

# v1.2.0 (2015-07-29)

- Added: `angularVerifyDependencyUsage` rule. #13.
- Fix: requireAngularDependencyOrder can handle unexpected code structure better. #21.

# v1.1.0 (2015-07-25)

- Fix: `requireAngularDependencyOrder` now handles multiple chained `route`/`state`
  definitions. This may have quite a big impact on projects since `jscs-angular` now will
  find a lot more offences than before, hence a minor version bump is warranted. #18.

# v1.0.2 (2015-07-21)

- Fix: Don't crash when `restrict` property is missing for `angularAllowDirectiveRestrictions`. #17.

# v1.0.1 (2015-07-21)

- License change fix.

# v1.0.0 (2015-07-21)

- Flatten [rule structure](flatten-link) to be able to disable and enable rules as any other rule in JSCS.
- Update dependencies.
- License change.

  [flatten-link]: https://github.com/tregusti/jscs-angular/commit/2e9336586e72ef4448370e245deceb9d90d82a73

# v0.1.0 (2014-09-15)

- Fix: In `angularRequireMatchingFilename`. #12.
- Initial usable release, hence version bump.

# v0.0.3 (2014-09-14)

- Added: `angularAllowDirectiveRestrictions` rule.
- Changed: `angularRequireDependencyOrder` rule now handle resolve objects, for both
  [ui-router][ui-router] and [Angular routes][ng-route].
- Changed: `angularRequireMatchingFilename` is now more configurable.

  [ng-route]: https://docs.angularjs.org/tutorial/step_07
  [ui-router]: http://angular-ui.github.io/ui-router/

# v0.0.2 (2014-09-06)

- Added: `angularRequireMatchingFilename` rule.
- Validate option values for rules.

# v0.0.1 (2014-09-03)

- Initial release with `angularRequireDependencyOrder` rule.
