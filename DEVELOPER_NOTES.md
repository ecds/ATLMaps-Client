**ATLMaps Quick Setup Guide**
*March 3 2016*
*Yang*

This setup note goes together with the Server (backend) setup note. Please refer to the other note to setup the backend correctly.

**Front end Setup**
Once you checkout the front-end repo you can, in the app root directory, do:
```
npm install
bower install
```

to have dependencies installed.
After that you should be able to run ember s to start the front-end ember server.
Now you can access ```http://localhost:4200```

However, if you see a blank page you should open the browser’s inspector/console to look for errors that prevented the app from loading properly. If you are on current latest branch what you might want to do is to checkout a feature branch that works:
```git checkout feature/routes```
* Note that this might change as our development work proceeds.

run ```ember s``` and check your browser at ```localhost:4200```

Good luck!
