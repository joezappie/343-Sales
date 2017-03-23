import os
import shutil
import urllib
import sys
import subprocess

# Links
githubURL = "https://github.com/jrj2211/343-Sales.git"
nodeURL = "https://nodejs.org/dist/v6.10.0/node-v6.10.0-linux-x64.tar.gz"

# Other important info
baseName = "sales-"
basePath = "/var/www/"
cwd = os.getcwd()
cwdParts = cwd.split("/")
appName = cwdParts[-1]
mysqlUser = ""
mysqlPass = ""
error = ""

def mainMenuOptions():
	# Define the main menu items
	return ["MAIN MENU", [
			["Start Node", startNode],
			["Stop Node", stopNode],
			["Restart Node", restartNode],
			["Update Node", updateNode],
			["Create Upstart Script", upstartNode],
			["Manage MySQL", databaseManager],
			["Manage Server", serverMaintenance],
		]
	]
	

def maintenanceMenuOptions():
	# Define items for the server maintenance menu
	return ["SERVER MAINTENANCE", [
			["Create New Node", createNewNode ],
			["Install Upstart", installUpstart],
			["Install Node/NPM", installNode],
			["Install MySQL", installMysql],
			["Install ALL", installAll],
			["Reroute Port 80", reroute],
			["Delete Route", deleteRoute],
			["Back", mainMenu],
		]
	]
	
def databaseMenuOptions():
	os.system('clear')
	global mysqlUser
	global mysqlPass
	
	# Get the root login for MYSQL
	while mysqlUser == "":
		print("Login to root MYSQL")
		if mysqlUser == "":
			mysqlUser = raw_input("Root User>> ")
		if mysqlPass == "":
			mysqlPass = raw_input("Root Pass>> ")

		try:
			subprocess.check_output(generateMysqlCommand(""), shell=True)
			break
		except subprocess.CalledProcessError as grepexc:                                                                                                   
			mysqlUser = ""
			mysqlPass = ""
	
	# Define items for the database manager menu
	return ["DATABASE MANAGER", [
			["Show Databases", showDatabases ],
			["Create Database", createDatabase],
			["Drop Database", dropDatabase],
			["Import SQL", importDatabase],
			["Back", mainMenu],
		]
	]
	
def generateMysqlCommand(command):
	return "mysql -u"+mysqlUser+" -p'"+mysqlPass+"' -e \""+command+"\""
	
def createDatabase():
	# Get the name of the datbase to create
	while True:
		dbName = raw_input("Database Name>> ")
		
		if dbName != "":
			break
		
	# Create the database
	os.system(generateMysqlCommand("CREATE DATABASE " + dbName))    
	pressAnyKey()
	
def dropDatabase():
	# Ask to show all databases
	showDBs = raw_input("Show Databases (y/n)? ")
	if showDBs == "y":
		os.system(generateMysqlCommand("show databases"))  
	
	# Get the name of the database to drop
	while True:
		dbName = raw_input("Database Name>> ")
		if dbName != "":
			break
	
	# Drop the database
	os.system(generateMysqlCommand("DROP DATABASE " + dbName))    
	pressAnyKey()
	
def showDatabases():
	# Show all the databases
	os.system(generateMysqlCommand("show databases"))    
	pressAnyKey()
	
def importDatabase():
	# Ask to show all databases
	showDBs = raw_input("Show Databases (y/n)? ")
	if showDBs == "y":
		os.system(generateMysqlCommand("show databases"))  
	
	# Get the name of the database to import to
	while True:
		dbName = raw_input("Database Name>> ")
		if dbName != "":
			break
		
	# Get the name of the file to import
	while True:
		sqlFile = raw_input("SQL File>> ")
		if sqlFile != "" and os.path.isfile(sqlFile):
			break
	
	# Import the file
	print("Importing file...")
	os.system("mysql -u"+mysqlUser+" -p'"+mysqlPass+"' " + dbName + " < " + sqlFile)    
	pressAnyKey()
		
def createUpstartFile(name, directory, port):
	# Generate the upstart file
	print("Creating upstart file...")
	upstartScript = "#!upstart\n"
	upstartScript += "description \"sales " + name + "\"\n"
	upstartScript += "\n"
	upstartScript += "start on filesystem and started networking\n"
	upstartScript += "respawn\n"
	upstartScript += "chdir " + directory + "\n" 
	upstartScript += "env NODE_ENV=production\n"
	upstartScript += "env PORT=" + str(port) + "\n"
	upstartScript += "exec npm start\n"
	
	# Write the generated file to the disk
	file = open("/etc/init/" + baseName + name + ".conf", 'w+')
	file.write(upstartScript)
	file.close()

def pressAnyKey():
	# Wait for a key press then clear the console
	raw_input("Press any key to continue")
	os.system('clear')
	
def restartNode():
	# Run the service restart command for the current node
	print("Restarting Node...")
	os.system("service " + baseName + appName + " restart")
	pressAnyKey()
	
def stopNode():
	# Run the service stop command for the current node
	print("Stopping Node...")
	os.system("service " + baseName + appName + " stop")
	pressAnyKey()
	
def startNode():
	# Run the service start command for the current node
	print("Starting Node...")
	os.system("service " + baseName + appName + " start")
	pressAnyKey()

def updateNode():
	# Update the current node to the latest master version
	print("Updating Node...")
	os.chdir(cwd)
	os.system("git pull origin")
	pressAnyKey()
	
def upstartNode():
	# Regenerate the upstart file for a node
	while True:
		try:
			# Need a port to route the node to
			routePort = int(raw_input('Port>> '))
			createUpstartFile(appName, cwd, routePort)
			break
		except ValueError:
			print "[ERROR] That wasn't a number"
	
def createNewNode():
	print("Creating New Node...")
	
	# Get information for the new node
	nodeName = raw_input("App Name>> ")
	nodePort = raw_input("Port>> ")
	nodeDirectory = raw_input("Directory (leave blank to use /var/www/)>> ")
	
	# Find where to put the node
	if nodeDirectory == "":
		nodeDirectory = basePath
	
	# Ensure proper pathing
	if not nodeDirectory.endswith("/"):
		nodeDirectory += "/"
		
	# Add the node name to get the full path 
	nodeDirectory += nodeName
	
	# Create the directory
	print("Creating Directory...")
	if os.path.exists(nodeDirectory):
		# Check if deleting current files and overwriting an existing folder is desired action
		overwrite = raw_input("This app already exists. Overwrite (y/n)?")
		if overwrite !="y":
			# Its not so lets just abort 
			print("Aborted.")
			pressAnyKey()
			return
		
		# It is so remove the directory
		shutil.rmtree(nodeDirectory)
		
	# Create the directory
	os.mkdir(nodeDirectory)
	os.chdir(nodeDirectory)
	
	# Checkout the github 
	print("Cloning Repository...")
	os.system("git clone " + githubURL + " .")
	
	# Run npm installer
	print("Installing Dependancies...") 
	os.system("npm install")
	
	# Change back to default directory
	os.chdir(cwd)

	# Create a new upstart file so that "service" can be used to run node
	createUpstartFile(nodeName, nodeDirectory, nodePort)
	
	pressAnyKey()
	
	
def installUpstart():
	# Download and install upstart
	print("Installing Upstart...")
	os.system("sudo apt-get install upstart")
	pressAnyKey()

def installNode():
	print("Downloading Node...")
	
	# Download the desired node package
	os.chdir("/usr/local/")
	nodeInstallPackage = urllib.URLopener()
	nodeInstallPackage.retrieve(nodeURL, "node.tar.gz")
	
	# Install node 
	print("Extracting Node...")
	os.system("sudo tar --strip-components 1 -xzf node.tar.gz")
	
	# Need symbolic links to be able to run node/npm without full paths to the executables
	print("Creating symbolic links")
	if not os.path.exists("/usr/bin/node"):
		os.system("ln -s /usr/local/bin/node /usr/bin/node")
	if not os.path.exists("/usr/bin/npm"):
		os.system("ln -s /usr/local/bin/npm /usr/bin/npm")
	
	# Remove downloaded files
	print("Cleaning up...")
	os.remove("node.tar.gz")
	
	# Print the versions just for verification
	print("[Versions]")
	nodeVersion = subprocess.check_output(["node", "-v"]);
	npmVersion = subprocess.check_output(["npm", "-v"]);
	print("node: " + nodeVersion.strip())
	print("npm: v" + npmVersion.strip())
	
	pressAnyKey()
	
def installMysql():
	# Download and install MYSQL
	print("Installing MySQL...")
	os.system("sudo apt-get update")
	os.system("sudo apt-get install mysql-server")
	os.system("sudo mysql_secure_installation")
	os.system("sudo mysql_install_db")
	
	# Enable remote access
	print("Allowing connections through port 3306")
	os.system("iptables -I INPUT -p tcp --dport 3306 -m state --state NEW,ESTABLISHED -j ACCEPT")
	os.system("iptables -I OUTPUT -p tcp --sport 3306 -m state --state ESTABLISHED -j ACCEPT")
	
	pressAnyKey()
	
def installAll():
	# Do all the installs
	installUpstart()
	installNode()
	installMysql()
	
def reroute():
	# Reroute port 80 to a port a node server is running on
	print("Rerouting Port 80 to Specified Port...")
	
	# Get the port number
	while True:
		try:
			routePort = int(raw_input('Port>> '))
			
			# Route 80 to inputted port number
			os.system("sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port " + str(routePort))
			break
		except ValueError:
			print "[ERROR] That wasn't a number"
	
	pressAnyKey()	
	
def deleteRoute():
	# Delete a previous route
	print("Delete a route by selecting its route num\n")
	
	while True:
		# Print the list of routes
		os.system("iptables --table nat --list PREROUTING --line-numbers")
		routeNumber = raw_input('\nnum>> ')
		if routeNumber == "":
			break
		# Delete the route by its number
		os.system("sudo iptables -t nat -D PREROUTING " + routeNumber)
		
	pressAnyKey()	
			
def serverMaintenance():
	# Change the current menu
	global currentMenuOptions
	currentMenuOptions = maintenanceMenuOptions()

def mainMenu():
	# Change the current menu
	global currentMenuOptions
	currentMenuOptions = mainMenuOptions()
	
def databaseManager():
	# Change the current menu
	global currentMenuOptions
	currentMenuOptions = databaseMenuOptions()
	
currentMenuOptions = mainMenuOptions()

while True:
	# Clear the console
	os.system('clear')

	# Print the menu header
	print("=== " + currentMenuOptions[0] + " ===")
	
	# Print all the options
	optionId = 1
	for option in currentMenuOptions[1]:
		print(str(optionId) + ". " + option[0])
		optionId += 1
	
	# Show the error message if it exists
	if error != "":
		print(error)
	
	# Get the users menu option
	menuOption = raw_input(">> ")

	error = ""

	# Check that the inputted menu option was valid
	try:
		menuOptionSelected = currentMenuOptions[1][int(menuOption) - 1]
	except:
		error = "[ERROR] Unknown Option."
		continue
	
	# Run the command for the selected menu option
	if callable(menuOptionSelected[1]):
		menuOptionSelected[1]()
	else:
		print("Failed to run command")
		pressAnyKey()
		continue

