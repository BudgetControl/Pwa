const gulp = require("gulp");
const gap = require("gulp-append-prepend");

gulp.task("licenses", async function () {
  // this is to add Mlab Factory licenses in the production mode for the minified js
  gulp
    .src("dist/js/*.js", { base: "./" })
    .pipe(
      gap.prependText(`/*!

=========================================================
* Vue Notus - v1.1.0 based on Tailwind Starter Kit by Mlab Factory
=========================================================

* Product Page: https://www.mlabfactory.it/product/budget-control
* Copyright 2021 Mlab Factory (https://www.mlabfactory.it)
* Licensed under MIT (https://github.com/BudgetControl/Application/blob/main/LICENSE.md)

* Tailwind Starter Kit Page: https://www.mlabfactory.it/learning-lab/tailwind-starter-kit/presentation

* Coded by Mlab Factory

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/`)
    )
    .pipe(gulp.dest("./", { overwrite: true }));

  // this is to add Mlab Factory licenses in the production mode for the minified html
  gulp
    .src("dist/index.html", { base: "./" })
    .pipe(
      gap.prependText(`<!--

=========================================================
* Vue Notus - v1.1.0 based on Tailwind Starter Kit by Mlab Factory
=========================================================

* Product Page: https://www.mlabfactory.it/product/budget-control
* Copyright 2021 Mlab Factory (https://www.mlabfactory.it)
* Licensed under MIT (https://github.com/BudgetControl/Application/LICENSE.md)

* Tailwind Starter Kit Page: https://www.mlabfactory.it/learning-lab/tailwind-starter-kit/presentation

* Coded by Mlab Factory

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

-->`)
    )
    .pipe(gulp.dest("./", { overwrite: true }));

  // this is to add Mlab Factory licenses in the production mode for the minified css
  gulp
    .src("dist/css/*.css", { base: "./" })
    .pipe(
      gap.prependText(`/*!

=========================================================
* Vue Notus - v1.1.0 based on Tailwind Starter Kit by Mlab Factory
=========================================================

* Product Page: https://www.mlabfactory.it/product/budget-control
* Copyright 2021 Mlab Factory (https://www.mlabfactory.it)
* Licensed under MIT (hhttps://github.com/BudgetControl/Application/LICENSE.md)

* Tailwind Starter Kit Page: https://www.mlabfactory.it/learning-lab/tailwind-starter-kit/presentation

* Coded by Mlab Factory

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/`)
    )
    .pipe(gulp.dest("./", { overwrite: true }));
  return;
});
