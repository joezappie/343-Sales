## Project for SWEN-343 Sales
### Environment notes

This document will assume you are running in a linux environment. I highly reccomend it for developing.
Boot up a fresh VM on your personal computers with your choice of linux distro on it.
VirtualBox is a good tool for windows and mac, you can get it from [here](https://www.virtualbox.org/wiki/Downloads).

### Installing Node and npm

First, download the tar for node into the directory of your choice.
```
cd ~/Downloads
wget https://nodejs.org/dist/v6.10.0/node-v6.10.0-linux-x64.tar.gz
```

Next, install the tarball
```
cd /usr/local
sudo tar --strip-components 1 -xzf ~/Downloads/node-v6.10.0-linux-x64.tar.gz
```

Verify the installation of node and npm (node pacakge manager)

```
node -v
npm version
```

Congratulations! Node and npm are installed, now we can move on.

### Setup the project

Clone the project into the directory of your choice. I would suggest tring to get ssh keys set up.
```
[sudo] git clone git@github.com:jrj2211/343-Sales.git
```

CD into the directory and install the node modules
```
cd 343-Sales
npm install
```

Alright so that was pretty cool, it installed everything I outlined in package.json
Next all we need to do is start up the server

```
node server.js
```

Now open up a new browser (if you're in a VM, a browser on your local machine will only work if you forward the port) and go to http://localhost:8080/api
If you see a JSON reponse, congratulations you've started our server! That was easy.

Thanks to the people over at [scotch.io](scotch.io) for a great getting started guide I found [here](https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4)
