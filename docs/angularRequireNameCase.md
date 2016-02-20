# `angularRequireNameCase`

If the value is a string with one of the casings below it requires that the filename without
extension exactly matches the name defined in the file and both have the specified casing.

If the value is an object or an array of objects, the object define a rule that the names must follow.
For instance, you can require that the file name should be dash cased like `my-thing.js`, and the
corresponding component name should be pascal cased like `MyThing`.

When using an array of rules, at least one of the rules must apply, otherwise it fails the style check.

Available casings are:

- `dot`: `my.file.name.js`
- `dash`: `my-file-name.js`
- `camel`: `myFileName.js`
- `snake`: `my_file_name.js`
- `pascal`: `MyFileName.js`
- `constant`: `MY_FILE_NAME.js`

**NOTE**: Directives, and therefore components, are always required to be camel cased since Angular
itself [requires this](https://docs.angularjs.org/guide/directive#creating-directives).

## Valid object example

```json
{
  "angularRequireNameCase": {
    "component": "pascal",
    "filename": "dash"
  }
}
```

With a file named `assets/good-controller.js`:

```javascript
angular.module('app').controller('GoodController', function() {

})
```

## Valid array example

You might use both pascal and camel casings in a project depending on the kind of module, then do it
like this:

```json
{
  "angularRequireNameCase": [{
    "component": "camel",
    "filename": "camel"
  }, {
    "component": "pascal",
    "filename": "pascal"
  }]
}
```

With a file named `assets/goodController.js`:

```javascript
angular.module('app').controller('goodController', function() {

})
```

## Invalid example

```json
{
  "angularRequireNameCase": "camel"
}
```
With a file named `assets/badController.js`:

```javascript
angular.module('app').controller('BadController', function() {

})
```
