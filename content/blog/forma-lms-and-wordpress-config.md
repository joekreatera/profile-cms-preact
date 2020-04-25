---
title: Forma.lms and Wordpress config
date: 2020-04-25T12:03:44.210Z
subtitle: A great way to integrate content and LMS
tags: lms wordpress cms
---

The **education** as we know it is changing. Times that remind us how to outperform ourselves with different ways or even disruptions are just around the corner. Is the moment for the world to get a reality check and see for ourselves what are the options for **learning** and **training**. 

As one of the projects I'm working on, a **LMS was needed**. This was not a requirement from the very beginning so a couple of risks (we knew they were risks when we had this challenge) were taken:

1. A server was bought to get the site going. We did not think about a serverless stack or even lambda functions on Amazon, just to be able to do some crazy configuration stuff (one thing that has no happened yet).
2.  The plaform used for the site in general was Wordpressed due to the very fast nature of the "get out and publish content" way of the software. IT Team had already experienced WP sites previously so it was a good call.

Forma.lms is a system to implement a learning  management system in a private server. It has an organization behind and has been actively promoted for 5 years approximately. 

When we took the task of implementing the LMS, there were at least three options:

1. Develop one
2. Install one
3. Get one as SaaS (or getting one on [AWS](https://aws.amazon.com/) as a mix).

As the organization had already invested in a pretty good server, we discarded the last option and set for the development or installation. As the time was a constraint (and so the resources), I went for number 2 being the homework the research of some of the best LMS. 

I checked at least 15 options, some of which appeared as great but they were too expensive (Blackboard competitors) and most of the them required a hired services. The final match was among these:

1. Open EdX: actually this was the best option. It had an app already made, the system is quite robust, there's an option to charge for the courses, there is a stong CMS side and a great student front-end. Restriction: it had to be installed on our server. Some of the requirements of Open EdX are very specific to the linux required and the general settings. I think they're actually so precise that they recommend the installation on a docker image on AWS rather than making it on you own. As the reader might guess, we had problems with this option, taking more time that it was expected to. The documentation is extensive but it has already so many options and versions that is very easy to get lost. Anyway, if the AWS deployment is an option, this is a great way to start your own e-School. Check it out on [OpenEdx](https://open.edx.org/get-started/get-started-self-managed/)
2. Forma.lms: as this was the second option, traditional LAMP site, it would not be the best. I was surprised of how easy it was to install, the so many options it has (even an LDAP connector), update procedure and the fact that it is a software that I can explain to the not so young academic content manager.  

I think that there was another one, **node.js** based, but there was some requirement it did not meet.

So, everything was decided (after some OpenEdX weeks test and frustration), I downloaded the package to the server, unzip, run install (php web based) and I had the site running. Some stuff to keep in mind:

1. When implementing this systems, especially with a start up, remember that someone has to explain the rest of the non IT team how it works and what does it need. The more difficult the platform is, the greater the learning curve will be. 
2. PHP and mysql software, as old as it might appear, have still a great cost-benefit evaluation. They are easy to implement, grow as long as you can maintain, maybe help you with an MVP and then you can decide to keep it or move to another piece of software provided that, still, it is easy to check how they are done and how to export the data. 
3. E-learning systems have already standards out there to export the courses. Forma.lms has [SCORM](https://scorm.com/?utm_source=google&utm_medium=natural_search) integrated already! 

Once the product was installed, it came the second part, producing the content we needed. This was pretty straightforward as it is a classical tinymce user interface. I must admit that there was some confussion at first when creating the course, assigning it, showing it to the users and getting the progresss. After a couple of hours or tutorials reading, this is just as easy as it gets. 

The not so easy part (at first) was to connect FORMA.LMS to the front wordpress site that we had. As a requirement, just to add some flavour, the users had to log in to the WP site but use that login for LMS. We thought we would have to make some php-magic generating a copy of the user once it signed up at WP site, or maybe forcing the sessions on FORMA.LMS. 

After some research hours, this plugin appeared on the screen:

[FLC forma.lms connector](https://wordpress.org/plugins/flc-forma-lms-connector/)

I thought that someone was watching us, becuase it was so designed for us. And this is what made me write this POST, the following part. It might sound easy, but I did not found any documentation that takes the developer through it. So, here it comes the configuration story:

1. An update was needed. To be clear, the steps to update FORMA.LMS are here:
    - [Installation and upgrade](https://www.formalms.org/reference-guide/installation-and-upgrade/installation-and-upgrade-2.html)
    - This area of the site is probably the most important: [Reference Guide](https://www.formalms.org/reference-guide.html)
2. After the update (that completes in seconds), log in as an admin and open the settings area

    ![Forma%20lms%20and%20Wordpress%20config/Untitled%202.png](Forma%20lms%20and%20Wordpress%20config/Untitled%202.png)

3. Open "OTHER OPTIONS" just in the header of configuration page (yes, it is a menu, not a title)

    ![Forma%20lms%20and%20Wordpress%20config/Untitled%203.png](Forma%20lms%20and%20Wordpress%20config/Untitled%203.png)

4. Do click on API and AUTHENTICATION
5. Enable SSO with a third party software though a token
6. Set the token secret for the token hash (you will be needing this on wordpress)
7. Enable the API functionality
8. Set authorization secret key as the method
9. Set the Authorization API key (yourself). You can try something like [API Key Generator](https://codepen.io/corenominal/pen/rxOmMJ) 
10. Set the API Key secret (same stuff)
11. Save Changes and you're done on Forma.lms side. Keep in mind that you will need API Key and API Secret on wordpress side. 
12. Log in to your wordpress
13. Install Forma.lms connector on plugins. It will appear on the side once it is installed and activated

    ![Forma%20lms%20and%20Wordpress%20config/Untitled%204.png](Forma%20lms%20and%20Wordpress%20config/Untitled%204.png)

14.  In the tabs, set in order the needed fields
    1. Address: the full URL of the domain in which the index.php if forma.lms is. Including the http or https protocol. 
    2. Key: API key you just set
    3. Secret: API secret you just set. 
    4. Save Changes and go For Users Tab
    5. Enable
    6. Save Changes and go for SSO tab
    7. Enable it and set the SSO key that you generated on step (6)
    8. Save Changes
15. You are set!  The plugin automatically generated a static page on your site called forma.lms SSO. Every toime you need a user to log into forma.lms, just redirect to this satic page and you 're set, the user will go directly intoyour LMS. 

So far this has been my experience with forma.lms. We're starting rolling out the courses (Human Rights course)  on [VIVARAMA.GLOBAL](http://vivarama.GLOBAL) (on spanish). Hope this chronicle and tutorial like post helps whnever you want to integrate WP and LMS. 

Happy developing!

![joeLogoStroke.png](joeLogoStroke.png)