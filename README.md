Private App
==============================

Framework - AngularJS with a backend ruby connect


Folder 

<Folder>/<entity>.html -  Template for Entity landing page(URL:/<entity>)
<Folder>/<entity>.add.html - Overlay termplate for Entity add page (URL:/<entity>/add)
<Folder>/<entity>.delete.html - Overlay template for Entity delete (URL:/<entity>/delete/<id>)
<Folder>/<entity>.controller.js - Angular Controller for Entity delete (Controller : <entity>Controller & <entity>EditController & <entity>DeleteController)

Folder

- accounts -Refer template above
- app-content - CSS Styling file
	app.css
	styles.css
 - app-services - Angular Services consumed by the app
 	authentication.service.js - Service for hitting Rails enpoint and sauthenticating the user
 	flash.service.js - Service for displaying Flash Error and Success Message across the site
 	user.service.js - Service for http request to Rails Endpoints
 -css - All contributed module CSS rests here
 -fonts - Glyphicon fonts
 -home - Folder for calendar
 	home.controller.js - Angular Controller for Calendar Page (URL: /calendar)
 	home.view.html - Template for calendar view
	
 -img - Site wide images	
 -js - All contributed module JS rests here 
 -login - 
  	login.controller.js - Angular Controller for login Page (URL: /login)
 	login.view.html - Template for login view	
 - ounit -Refer template above	
 - pages -Static pages across site
 	footer.html & navigation.html -> File in use
 -profile - 
  	profile.controller.js - Angular Controller for Change profile picture Page (URL: /profile)
 	profile.view.html - Template for Change profile picture Page View		
 -project - (URL : /mapping)
 	project.controller.js - Mapping Page Controller
 	project.html - Mapping Page template
 	project.calendar.html - Calendar popup in mapping page
 -register	(URL : /register) (Obsolete feature as of 08-02-17)
 	register.controller.js - Register Page Controller
 	register.view.html - Register Page template	
 -reports	(URL : /home) 
 	reports.html - Landing page for reports or dashboard
 	reports.controller.js - Reports Page Controller
 	reports.view.html - template for  drilldown popup
 	bullet-cell.html - Row wise meter for Utilization template
 -resources (URL : /resources)  -Refer template above
 -roles (URL : /roles) -Refer template above
 -serviceproject -Refer template above(EntityName:Project)(URL: /projects)
 -services -Refer template above(URL: /services)
 -skills -Refer template above(URL: /skills)
 -timesheet -Refer template above(URL: /timesheet)
 -app.js - Main JS file where Configurations and dependencies are specified
 -index.html - Parent HTML 
 		
