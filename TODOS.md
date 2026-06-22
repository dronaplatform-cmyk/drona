
ek error logging method, maybe in a discord community of a WA community will , everywhere a frontend error occure we will pormpt users to go to a certain place (where users will get a guide on where to report thiss error) like to join WA comm or a new DC server so that users and can straight dump into the server to report the issue to you, what would you choose 
Can we use QR codes for them to scan instead of typing?  qr holds the login details like discord but have or have most secire  flow for student sensitie data and all 

modify relavancy in auth header and auth pages, "single tabs layout????idk "

Automatically trigger after a certain duration (like 2 hours) via a cron job but the oroblemis we cant trakc scron jobs for multipleclasses here inthe apps for multipel students-tutors-classes, and also a manual button to end class we will see cron job later of add a `endTime` column i nclassses db which will upodated when this time auto made wil pass.  Right now, classes start but never officially "end" in the system. We need to implement the transition to COMPLETED. 
 We need to add a shadcn date time picker taking component in the book class model and then the parent selectsush a class for his child are you start setting calendar and time component and use the OTP component in the show enter code filed use the shacn otp component, 

we ned to set classes schdedule based on recurring basis as per parent choice, thre shuld be tick buttons weekday tick buttons that set a recurring scedeule for a class entry in the database, becasueth class.ts ahs a array of schedule wee need to fit in this but how do we takle teh infinite dates problem here, we cant storeinfitnitelyrecurring schefule or too big chucksof data of repeating schedules so we need to solve this first  cant be set as of now
 
either we stre the repetaing weekdays and update is on teh , but it must handle the edge cases of the dates and the timezones and the recurring schedules, like some for of key {mon,tue, wed},{mon,wed},{mon,tue, wed, thu, fri, sat, sun} and then we can generate the dates and times for the next 30 days or so, this will be a good solution



chek the walskthoufht and and try again implementing it corectyly the fow  


the flow was that parents can view tutropeofile scehdule a class with one of their children or a child, not like you have implement rightnow, parent will search whrer parent will come scross a tutor peofile he lies then he can bok a class with one of his schildren adn and that tutor. got it? 

tutot cannot touvh My Classes none of the clas is clickable to show info that you saying 
student login not working with correct uuid and correct password123 password , adding form where parent can add student is not storing passworkin in bcrypt. and not working login as student

we cannot touch click the scehduled cl   asses , no code  is genrated in 

the flow was that parents can view tutropeofile scehdule a class with one of their children or a child, not like you have implement rightnow, parent will search whrer parent will come scross a tutor peofile he lies then he can bok a class with one of his schildren adn and that tutor. got it? 

tutot cannot touvh My Classes none of the clas is clickable to show info that you saying 

tutor can upload the Homework and resources to the  to the respoective class that t student or tutorS HAVE  seemless mechanism   
book class notification to the teacher side from teh parent dashbord, parent will book class to tutor, or call the tutor i have the cbuttons 
cant i implement websockets without having dedicated server
https://lordicon.com/icons/system/regular?c=143&f=free&i=117-bolt

a code is generated on students side so that when tutors enters it the turos is verified to take a class, i need some form of plaknnig on this , maybe like a jwt encoding devcoding that is only verifiing hte class id  the tutot id astudients assigned to , somehing like htese paramters so that we have authenticated code entering and on tutor anad class verification, not like any sigle jwt secret can decode all any of the student class codes, the codes will be genrated everyday of on the class tiem student will trigger anad nanual process that generates and tokena adn teutor enters to verify the class prioces and begn with d o you get it? but before that we'd need clas sceduling mechanicsm , tutors can create class, once a tutor is assigned to students a recordign class eill be adsigned to between tutor and thte corspensing student  , this is how Attendance wil;l work , we hav e implemetn the ui of this now need logic , with attendance history 


don't modify the the majority breadcrumb logic but if you detect  an i from teh dsatbase in the name , fetch teh name from the db make the call asnd fetch teh name form the db and diplay in the breadcrumb , do this for only IDs when enoutering IDs in the breakdbroumb or the URL , thake those IDS snad and diaply by fetcvh ing the name form the respoective ID fromthe db 




 
don't modify the back end or anything don't build yet I'll see it myself
don't modify any rest of the code keep it as is don't modify any CSS just and tasks listed above users have to basic components on every page that is being rendered on front end 
 




 
pamyent system comisoon vs no direct paymeent, cash option marketplace fee, 
call now nutton, profile card enhancement 
do not allow to bookclass when student view is open
share tutor proldide code , abasic text inforand link to profile 

move the compoents to companent/landing.tsx to prevent confusion in the main landing page.
to implement caching , ratelimitting, paginations to prevent excessive api calls. 
        



DUMMY DTA GENERATION FOR CLASSES atTENDANCE PER STUDENT , every model in schema

50 parents , their child added as STUDENT min : 1 and maximum 3 children  per parent
100 tutor profiles, their subjects the calleases per student , home work, reports, tutor parent query per parent , tuto student query per student  ,   
need and do , next js routing refactoring , queries visible on tutot dashboard as well 



profile (for crud prfile maintenance and updation)
        tutor
        student
        parent
student 
        dashboard
        homework
        attendance (shared  across student 'r', tutor 'rw' parent 'r')
        query (we should keep to have student-tutor discussion , and keep parent tutor query page separate fro student )

tutor
        dashboard

parent 
        payments
        query (for tutor parent discusion)

should we keep reports and attendance, shared under student so that parent and student can read reports, tutor can upload reports , just add a dummy data there in page meanitme  

auth routes are ok under correct filter grouped nicely 

take the links from the sidebaar you added and add dumy line in veyr page you create accoridn o the sidebar lnks you mentioend 

 
Tutor can upload  resources pdf/ add link to any video/ text/images. wil add direct video upoad later we wont fill our storage spcce so early
Tutor comem on home theres should also be a dedicated qr for a assignemed generated for a  student one-tie and then later per day a new qr ill be gnerated so that tutot can't hack the previous qr to mark attendance without coming home.  
qr generatio on demand, when it is clicked it will save server resouces, scan to mark attendace otherwise aut marked a tutor was absent. 

pwa notifications utilitity that call it wth a payload of text/image/etc,

--------------------

## template
analyse the directory structure first note iwhat is already implemenet and what can be imporveed and then proceeed to next Provide a full, production-ready **development plan** for building the system described in the attached document. The plan must be exhaustive and actionable tona — not high-level fluff — and must include all of the following exactly:

1. **Scope & deliverables** — clear list of features, MVP, acceptance criteria.
2. **Execution strategy & sprintable action steps** — ordered tasks, estimated priority and testing checkpoints.
3. **Backend architecture** — folder layout, core services, workers/jobs, data models, (postgres prisma schemas), services api on frnend. and technology choices , a progressive web app frontendd in  nextjs  and backend in prisma postgres, redis caching, i am using  bun as a package manager, must be used bun. make it 
4. **API route layout** — complete REST route list (prefix, verbs, path, purpose, auth requirements) and sample request/response shapes for each endpoint.
with axios make as a service/api.js,

impose proper middlewares fro auth verified check, register as hostial patienr therrimifdlleware and ema
il verification with nodemailer
5. **Controller-level business logic** — per-route pseudocode outlining validation, authorization, transactions, side effects, error handling, and retry semantics 
6. **Auth/session design** — JWT access token + refresh token flow, rotation strategy, cookie vs header usage, CSRF handling, token revocation, role claims, and refresh endpoint semantics.
cors handling Frontend calls  
7. **Frontend architecture & routing** — nextjs (PWA) folder structure, page routes, component responsibilities, state management strategy (Redux reduc toolkit ), SW registration and push-subscription flow. shadcn talwind is already setu setup, some routes have already setup you may imporove backend. 
8. **Frontend–backend integration** — axios/fetch client patterns, interceptors for token refresh and retry,

12. **Security & validation** — input sanitation and proper field valiedation sing zod schemas,backedn api rate limiting, secrets management, HTTPS/TLS, CORS, and recommended libraries/config.
13. **Testing matrix** — dont build now no requirement, later job 
14. **Observability & monitoring** — dont build now no requirement, later job , but do a app and backend health checking routes.

Produce the plan as a developer-ready blueprint containing concrete commands, code snippets or pseudocode where appropriate, JSON shapes for schemas and API payloads, and explicit bun scripts and Docker commands to run and test locally. No conceptual overview only — include exact, repeatable steps and examples that an engineer can implement immediately.
 

ask me questin before startin about techstack an other from the docuement

Software Requirement Specification

1. Introduction
1.1 Purpose:
The vision is to create a platform that acts as a middlemen between the tutors and parents.This will cater the need of tuitions for any age and class broadly.The dual aim is to ease the onboarding process of apt tutor for the child and curb all kind of frauds and provide the real talent a platform for their passion and cater to the bigger vision of employability in our country. This app is also focusing at promoting knowledgeable youth indulgence in teaching and earning.
1.2 Scope:
 The system would give a platform to the parent to find a suitable home tutor as per the specific requirements of their child.And for the tutor it will cater the best by providing them beautiful connections with children and part-time source for them.
1.3 Definitions:
 TPC – Teacher–Parent Communication System
 User – Teacher or Parent
1.4 References:
none
2. Overall Description
2.1 Product Perspective:
 A mobile and web-based application for real-time updates.
2.2 Product Functions:
Post queries for need of a tutor
Updates for class cancellation - tutor or parent
Parent–Teacher messaging/chat
Payment interface-for parent
Calendar schedule

2.3 User Characteristics:
 Parents and tutors with basic smartphone/computer usage.
2.4 Constraints:
 Requires secure login, stable internet, and device compatibility.
2.5 Assumptions & Dependencies:
 Parents and tutors have active registered accounts.
3. Functional Requirements
FR-1: User Authentication
 System shall allow parents and teachers to securely log in.
FR-2: Profile (Teacher)
A standard should be appeared by the tutor for authenticity of his knowledge
FR-3:Query (Parent)
 Teachers can upload daily homework or classwork details.
FR-4: Progress Reports
 Teachers shall upload performance reports viewable by parents.
FR-5: Messaging
 System shall provide a chat feature for teacher–parent communication.
FR-6: Notifications
 Parents receive notifications for cancellation of class or messages.
FR-7: Feedback form 
Users should give feedback on the performance of application and any open suggestions.
4. Non-Functional Requirements
Performance: System must support at least 300 concurrent users.
Security: All messages and data must be encrypted.
Usability: Interface should be simple and accessible for all age groups.
Availability: Service should be available 99.5% of the time.
Scalability: System should support addition of new classes and users.
5. System Interfaces
User Interface: Dashboard for teachers and parents with match data should appear on their home page
Software Interface: Database has to be made of Tutors and Parents
Hardware Interface: Works on smartphones, tablets, and computers.

All features must be functional including messaging, attendance, and homework updates.
System must maintain real-time notification delivery and secure communication.



-------


routes associated wihth this, 
crud teacher profile
crud parent profile
crud student profile, maintained by parent. in india where tech literacy is not that high will giving ontrol everythin to parent will moreover increase the issue in usage of our app right? 
and rest of the routes requested in softwre requiemnets

Payment Gateway: Razorpay
- Real-time Communication: 
WebSockets  Socket.io  maybe with redis caching.
- Deployment Target:
i will be first deplying to vercel for testing later we can migrate to a vps, t the service is going to be run for  acouple of months on vercel i guess. is that causing a isue n hardcoded codebase change will that cause changes in codebase?
- Email Service:  
"nodemailer".  i will be testing a email service sfirst since i dont have a verfied domain, credit card or anytin to get a emal service plan.

- Typo Clarification: 
yes, Tutor/Parent middleware


-------

this is going to be pwa web app, no mobile app, we may skip the websockets part to skip the complexity of getting/setting/paying up a server and build the chat feature later after building the main mvp , skip email for now. 

we will generate a unique student id 
year+7_characters_uniuely_identifiable_string_across_the_database_uuid_is_too_long
and password, visible to parent dashboard, if student has mobile one or more mobile in their home they can eaily login into the devices and sart learninng, but another problem is that if home only has a parent device student got no device how wil we mitigate this problem. 
my oncern is  If a parent struggles with tech espiceial y with teh tech literacy rate in india , they will get overwhelmend by the procecss th and outr app will not work there in india.


### Explicit Constraints (Non-Negotiable)

- Do not modify backend structure much.
- Do not build new features yet.
- Do not change REST APIs.
- Do not modify existing code unless required for the issues listed.
- Do not change any CSS.
- Do not alter existing logic outside the listed tasks.
- Base components under ui/ and components must remain present and untouched logic change allowed.

I will review and implement myself after verification.
