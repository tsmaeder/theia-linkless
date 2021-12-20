# theia-linkless
A demo Theia app showcasing build without source linking. It's based on an app generated with the theia extension generator.

In order to build this app against a source installation of Theia, proceed as follows:

1. Checkout out Theia in a convenient location
2. Build theia by invoking `yarn` in the root folder
3. invoke `node link.js <theia source folder>` inside the folder inside this folder
4. build the app using `yarn` inside this folder

The idea is to `yarn link` all relevant Theia packages and to invoke `yarn link <module>` inside the app root folder for each of those packages.
