# `allowDirectiveRestrictions`

This option allow you to specify valid restrictions for directives. The value is a string with one
or more of `E`, `C`, `M` and `A`.

## Example

With this configuration:

```json
{
  "angular": {
    "allowDirectiveRestrictions": "EA"
  }
}
```

This directive would be valid:

```javascript
angular.module('app').directive('goodDirective', function() {
  return {
    restrict: 'E'
  }
});
```

However, this directive would be invalid:

```javascript
angular.module('app').directive('badDirective', function() {
  return {
    restrict: 'M'
  }
});
```
