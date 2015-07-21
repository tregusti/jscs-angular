# `angularRequireMatchingFilename`

This rule ha two different modes. If the value `true` is supplied, it requires that the filename
without extension exactly matches the name defined in the file. No matter the casing of he name.

If the value is an object or an array of objects, the object define a rule that the names must follow.
For instance, you can require that the file name should be dash cased like `my-thing.js`, and the
corresponding component name should be pascal cased like `MyThing`.

Available casings are:

- `dot`: `my.file.name.js`
- `dash`: `my-file-name.js`
- `camel`: `myFileName.js`
- `snake`: `my_file_name.js`
- `pascal`: `MyFileName.js`
- `constant`: `MY_FILE_NAME.js`

When using an array of rules, at least one of the rules must apply, otherwise it fails the style check.

## Valid object example

```json
{
  "angularRequireMatchingFilename": {
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
  "angularRequireMatchingFilename": [{
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
  "angularRequireMatchingFilename": true
}
```
With a file named `assets/bad-controller.js`:

```javascript
angular.module('app').controller('BadController', function() {

})
```
