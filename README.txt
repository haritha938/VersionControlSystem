README: Notes on an HTML + CSS + JS +JQUERY
Time-stamp: <12/07/2019 @ 10:54pm (UTC) SHS>
------------------------------------------------------------
The project contains the following items:
i)	home.html : A web page with header, footer, a buttons(Create Repositoy, Check-in. Check-out, Display label Names,Create a label,Merge out, Merge-In, Command Line Interface) and an a few input fields.
ii)	home.js : It is a javascript file. When the request is made from the web page via button click , loads this script file. (provided that the home.js is already running at port 3000) 
iii)	README.txt 
iv)	SourceRepository: It is a sample source repository with 2 items.
	a.	hello2.txt
	b.	hello.txt
v)      Views : This folder has 2 files,label.ejs and message.ejs. These are used to render data to HTML. This require 'view engine' and can be installed using the command, "npm install ejs -save"


How to handle the above files to get results:

Step 1: Download the cod to local.

Step 2: 
	i)	Open command prompt and navigate to the same folder where the node modules are present.
	ii)	Enter command- node home.js
	iii)	A message, “home.js listening on port 3000!” is displayed on the command prompt.
Step 3: Open a web browser and enter the url, “http://localhost:3000/”. Then the web  page will be loaded, which contains five buttons and a few text fields.

Step 4: Create Repository button: Once user click on this button, user will be allowed to enter, Repo name, repo path and local path. Once all the details are entered and submit button is clicked, a confirmation message is displayed.   

Step 5: Similarly, Once user click on button Check-out, Check-in,Mergeout,Merge-In and Create a Label, user will be allowed to filled few details so as to get the task done. An appropriate confirmation message or an error message will be displayed based on the input provided by the user   

Step 6: To view the label names of a particular project in the repository, user can click on 'Display label names' button and provides the repo path, top 30 label names will be dispalyed.

Step 7: All the above functionality can be implemented using the commandline Interface using "CommandLine Interface" button.

Note: Files in SourceRepository are optional and are for testing purpose only.



 

