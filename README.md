<a href="blog" target="_blank">Tick Tock</a>
========

## Top Watch
HTML5 Stop Watch demo leveraging the Enyo Bootplate Application template for packaged Enyo. This is based on an app I built and blogged about called **TopWatch**. [TopWatch code is here](https://github.com/pcimino/TopWatch_Build).

The animated canvas seems to have issues on some platforms. Probably will work eventually as IE & Firefox and Webkit all approach a common HTML5 standard. For now some things don't work correctly.

## <a href="blog" target="_blank">TBD: Tick Tock</a>
An equally, or maybe even less, inspired name, Tick Tock removes the canvas from Top Watch and uses dual digital displays (time and split). There is also the addition of an email button to mail the split times. Externally the application is otherwise very similar.

# Deployment
Manifest files are included to easily deploy to various platforms. The webOS SDK will be require to use the build process.
## webOS
There are some **lazy** scripts for building and deploying the project to either the SDK emulator or a physical device. I only bothered to make .BAT files, but the underlying scripts exist in the tools/ directory.

**Nodejs**
If you have <a href="http://nodejs.org/" target="_blank">Nodejs</a> installed, you can launch the node server and run the app in an HTML5 compatible browser. The startup displays the <a href="http://localhost:8888/" target="_blank">localhost</a> link in the console.

##Zip it Up
Once you've built Tick Tock, look in the .../TickTock/deploy/ directory. You should see an unpacked directory **TickTock** and the .ipk file. The IPK is used to submit the application to the Palm/HP Catalog.

The TickTock/directory needs to be zipped up. Careful how you do it, the windows default to zip the directory ends up creating a zip with a nested directory.

##<a href="https://marketplace.firefox.com/developers/" target="_blank">Mozilla Firefox OS</a>
To validate the TopWatch.zip file, you can upload it to the <a href="https://marketplace.firefox.com/developers/validator" target="_blank">Validator to check it</a>.

Using the <a href="https://addons.mozilla.org/en-us/firefox/addon/firefox-os-simulator/" target="_blank">Firefox OS Simulator</a>, you can run the application in Firefox. This is also the easiest way to deploy the application to a physical device with Firefox OS installed.

The Zip is also what is submitted to the Mozilla Marketplace.

##Chrome Store
With Chrome, yuo can load and test the application locally <a href="https://developer.chrome.com/extensions/getstarted.html" target="_blank">using the Extensions settings</a>.

Once you have the Zip, you're ready to go through the <a href="https://developers.google.com/chrome/web-store/docs/publish" target="_blank">Chrome Store submission process</a>.

##<a href="http://developer.ubuntu.com/" target="_blank">Ubuntu</a>
(TBD)

##<a href="https://play.google.com/apps/publish/signup/" target="_blank">Android Google Play</a>
(TBD)

##iOS, Windows Phone and Blackberry?
I'm not setup for any of these, and not ready to make that effort right now. If you would like to try to fork Tick Tock and get it working any or all of these platforms, go for it. The goal would be to make the minimal changes required, and then pull your changes back into this project.