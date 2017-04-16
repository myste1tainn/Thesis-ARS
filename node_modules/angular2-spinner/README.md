# Angular2 Spinner

Simple preloading indicator.

![preview](preview.png)

## Instalation

1. Add `'angular2-spinner/**/*.+(js|css|js.map)'` angular-cli-build.js
2. Add the following in system.config.ts
 - Add in barrels `'angular2-spinner',`
 - Add in map `'angular2-spinner' : 'vendor/angular2-spinner'`
 - Add in packages
 ```
 'angular2-spinner' : {
    main: 'angular2-spinner.js',
    defaultExtension: 'js'
  }
 ```

## Usage

```
<spinner [size]="20" [tickness]="1" [color]="#ff66ff"></spinner>
```
