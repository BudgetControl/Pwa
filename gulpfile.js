const gulp = require("gulp");
const gap = require("gulp-append-prepend");
const fs = require("fs");
const path = require("path");

gulp.task("licenses", async function () {
  // Verifica se esiste la cartella dist/js
  if (!fs.existsSync(path.join(__dirname, "dist/js"))) {
    fs.mkdirSync(path.join(__dirname, "dist/js"), { recursive: true });
  }

  // this is to add MlabFactory licenses in the production mode for the minified js
  gulp
    .src("dist/js/*.js", { base: "./" })
    .pipe(
      gap.prependText(`/*!

=========================================================
* Vue Notus - v1.1.0 based on Tailwind Starter Kit by MlabFactory
=========================================================

* Product Page: https://www.mlabfactory.it/product/budget-control
* Copyright 2021 MlabFactory (https://www.mlabfactory.it)
* Licensed under MIT (https://github.com/BudgetControl/Application/blob/main/LICENSE.md)

* Tailwind Starter Kit Page: https://www.mlabfactory.it/learning-lab/tailwind-starter-kit/presentation

* Coded by MlabFactory

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/`)
    )
    .pipe(gulp.dest("./", { overwrite: true }));

  // Verifica se esiste la cartella dist
  if (!fs.existsSync(path.join(__dirname, "dist"))) {
    fs.mkdirSync(path.join(__dirname, "dist"), { recursive: true });
  }

  // this is to add MlabFactory licenses in the production mode for the minified html
  gulp
    .src("dist/index.html", { base: "./" })
    .pipe(
      gap.prependText(`<!--

=========================================================
* Vue Notus - v1.1.0 based on Tailwind Starter Kit by MlabFactory
=========================================================

* Product Page: https://www.mlabfactory.it/product/budget-control
* Copyright 2021 MlabFactory (https://www.mlabfactory.it)
* Licensed under MIT (https://github.com/BudgetControl/Pwa?tab=AGPL-3.0-1-ov-file#readme)

* Tailwind Starter Kit Page: https://www.mlabfactory.it/learning-lab/tailwind-starter-kit/presentation

* Coded by MlabFactory

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

-->`)
    )
    .pipe(gulp.dest("./", { overwrite: true }));

  // Verifica se esiste la cartella dist/css
  if (!fs.existsSync(path.join(__dirname, "dist/css"))) {
    fs.mkdirSync(path.join(__dirname, "dist/css"), { recursive: true });
  }

  // this is to add MlabFactory licenses in the production mode for the minified css
  gulp
    .src("dist/css/*.css", { base: "./" })
    .pipe(
      gap.prependText(`/*!

=========================================================
* Vue Notus - v1.1.0 based on Tailwind Starter Kit by MlabFactory
=========================================================

* Product Page: https://www.mlabfactory.it/product/budget-control
* Copyright 2021 MlabFactory (https://www.mlabfactory.it)
* Licensed under MIT (hhttps://github.com/BudgetControl/Pwa?tab=AGPL-3.0-1-ov-file#readme)

* Tailwind Starter Kit Page: https://www.mlabfactory.it/learning-lab/tailwind-starter-kit/presentation

* Coded by MlabFactory

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/`)
    )
    .pipe(gulp.dest("./", { overwrite: true }));

  return;
});
