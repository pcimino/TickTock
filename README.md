TopWatch
========

HTML5 Stop Watch demo leveraging the Enyo Bootplate Application template for packaged Enyo.

Refer to the [Wiki](https://github.com/enyojs/enyo/wiki/Bootplate) for how to get started with Bootplate

## Using Enyo to build and deploy on multiple platforms

This is the first part of a [multi-step tutorial](http://pcimino.blog.com/enyo/). The final goal is to take an Enyo application and deploy it to multiple platforms. In Part One, I point you to the resources you'll need to create and install the TopWatch application. I'll also take you througn the steps of building and deploying this application to a webOS device or emulator.

Far from a comprehensive tutorial. I provide guidance as to how I approached this problem and the tools I used to solve it. If you're a beginner, then you'll need to go to each resource and forllow those tutorials to install the correct tools. TopWatch is an implemented application, and I hope it provides you with some ideas on how to build and deploy your own app.

Most of the tutorials using Cordova (formerly PhoneGap) deal with starting from scratch or using the Cordova sample. These are all useful, for example if you're using Eclipse and the Android SDK to build an app from scratch. But when moving an existing application to PhoneGap they seem to be lacking. While you may not be moving a webOS app, you still may find this tutorial useful, I tried to explain some of the things I learned, and added links that I thought were especially useful. This tutorial does not detail all the dead ends I found trying various ways to build and deploy apps. The command line is useful for the webOS deployment, but painful for other platforms.

I did this on Windows 7, most steps are translatable to Linux or Mac. The tools all have Mac, Linux development paths and appropriate shell scripts.

I am not going to go through installing any SDKs, only source libraries. The goal is to build a working app and deploy it on as many platforms/emulators as I can (probably not iOS unless I get access to a Mac). I'm not going to delve into the different developer ecosystems or how to submit your apps.

Why Enyo? I'm partial to webOS. It also makes sense. and unlike my dusty Amiga 500, there's still some hope for webOS. Why is HP is still supporting it? Possibly as the interface into their cloud and enterprise services. I wanted to do this using Enyo 2, which has newer widgets for better cross platform support. I was getting bogged down in some of the details and decided to bail. My next project will be a multi-platform Enyo 2 application, but most of the steps below will still apply to the process. You can see the examples and [documentation here.](http://enyojs.com/) Take a look at the Showcase demos and you'll get a pretty good idea what Enyo provides out of the box.

## Perequisites

1. [Github Account](https://github.com/)
	You can probably get ZIPs of the projects without logging in, but setup an account so you can pull code and keep your local copies updated.
2. Node server and make sure it's visible in your command line
	This is used for the Bootplate build process
3. [webOS SDK development](https://developer.palm.com/content/resources/develop/sdk_pdk_download.html)
4. [Android SDK](http://developer.android.com/sdk/index.html) will require Eclipse and the Android SDK plugin
	a. add the path to the \android-sdk\tools to your PATH variable 
5. [Windows Phone Info](http://www.microsoft.com/en-us/download/details.aspx?id=27570)
6. [Java compiler](http://www.oracle.com/technetwork/java/javase/downloads/java-se-jdk-7-download-432154.html)
	a. setup the JAVA_HOME environment variable
	b. Add %JAVA_HOME%\bin to your PATH
7. [Apache Ant](https://ant.apache.org/bindownload.cgi)
	a. Unpack the ZIP file
	c. Setup the ANT_HOME environment variable
	d. Add %ANT_HOME%\bin to your PATH

## Workspace 
Create a directory where you want to setup code and follow this exercise. 
	c:\temp\Enyo
Open a shell and go there
	> cd C:\temp\Enyo
	
## Bootplate 
I'll be using the Bootplate template to get started. It's convenient, but one thing I don't like is the mix of tool and application. The index.html is in the root directory at the same level as the tools/, lib/ and source/ directories. I would much prefer the entire application goes into a source/ and then the complete app is output into the build/ directory.

You can follow the [Bootplate instructions here](https://github.com/enyojs/enyo/wiki/Bootplate). Here are the basic steps:

[Dupliforking](https://github.com/enyojs/enyo/wiki/Dupliforking)
<pre>
    > cd C:\temp\Enyo
    > git clone https://github.com/enyojs/bootplate.git TopWatch_Build
    > cd TopWatch_Build
    > git submodule update --init --recursive
    ( login to your Github account and create a [new repository here.](https://github.com/new)
    > git remote set-url origin git@github.com:your_username/TopWatch_Build.git
    > git push
</pre>
Now You have a templated HelloWorld project in Github, and you're ready to start building the app.
	
# TopWatch
The TopWatch project is already set up for Enyo using Bootplate. You can compile it using the webOS SDK, deploy it to your TouchPad or emulator. This is being released under the Apache software license. You're free to do with it as you will, except for trademarks, service marks and copyrighted logo artwork.
	http://www.apache.org/licenses/LICENSE-2.0

Git:<pre>
    > git clone https://github.com/pcimino/TopWatch_Build.git
    > cd TopWatch_Build
    > git submodule update --init --recursive
</pre>
These steps are not necessary if you're using the TopWatch project, but if you want to include other Enyo projects as submodules in your library:<pre>
    Add the canvas project as a submodule
    > git submodule add https://github.com/enyojs/canvas lib/canvas
    Add the Shape2D package
    > git submodule add https://github.com/pcimino/Shape2D.git lib/Shape2D
</pre>
## Code Structure

The location of code in bootplate is a little confusing. I would prefer Bootplate was more of a standalone utility, and you configure it to pul in and build your project. Instead your project becomes embedded into bootplate, bootplate becomes your project. While it's nice to have a template to build your project with, I think the locations of the build/deploy utilities and code resources could be a bit cleaner. If you're used to Enyo development for webOS, the directory structure is a bit different.

In the /source directory, look in the package.js file. This directs the build process to include these files in the minified application JavaScript file that gets deployed. Any libraries added to the project also get added, prefixed with the $lib path variable: the build scripts define this variable and expect the included libraries in the relative directory ../lib .

In an earlier iteration of this project, I modified the scripts so that all the project resources were in a /www directory, I don't like the icon, index.html and debug.html are in the root directory. However the bootplate project was refactored so that the deploy scripts are in the enyo tools. This also means resources, such as icons, need to go into either a library or the /assets directory, and then the application has to be coded to use the correct path. 

The ultimate goal is to have a PhoneGap application that can be deployed across multiple platforms. There are a few ways to try and manage this. Uaing the booltplate project as-is, means the output /deploy/bootplate directory is used to feed another project where additonal files are added for PhoneGap. 

Alternatively, I created the /www directory and put all the things I want copies to the root directory of the deployed application and crated variants of the deploy scripts: /tools/deploy_www.bat and /tools/deploy_www.sh.

These allow me to have a single project in TopWatch with all the icons and configurations I will later need for a webOS and PhoneGap application. The downside of this is a bloated project with more icons and property files than any one platform requires.

Realistically you might take the minified bootplate project and use that as a base for a new project, that in turn for specific PhoneGap projects. I'm not happy with this approach becasue you end up with multiple copies of the same codebase. The demon I'm wrestling with is I want bootplate to be a project template, but in reality it's a build template.

## Building the deployment

To build the base application using the bootplate deployment:

Shell
    /c/temp/Enyo/TopWatch_Build> ./tools/deploy.sh
Or Windows
    c:\temp\Enyo\TopWatch_Build> tools\deploy.bat  
  
## Packaging the Deployment
To install this on a webOS device or emulator, the app needs to be packaged
This assembles and minifies the code with the libraries in preparation of deployment. Having the /www directory means there are other resources I want in the project root directory, so instead, run the deploy_www.{sh | bat} file.
    /c/temp/Enyo/TopWatch_Build> ./tools/deploy_www.sh

This executes the following steps:  
    1. Deletes the ./deploy/bootplate directory to start clean
    2. Executes the ./tools/deploy script
    3. copies the contents of ./www to ./deploy/bootplate
	
## Deploying to webOS

In tools, you'll see install_webos.bat, sorry, didn't get to a shell script yet. running this script packages and deploys the app to a webOS device, edit the file and change the flag to flase to install on an emulator.

Windows  
    c:\temp\Enyo\TopWatch_Build> tools\deploy.bat
	
# Part II

Parts IIa & IIb are kind of lame, I'll basically take the output from Part I, and make it a Github project that can be incorporated as a submodule in Part III.

# Part III

In Part Three I'll show how to integrate with Cordova.
