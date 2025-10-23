# Working hours

|  day  | hours | things done  |
| :----:|:-----| :-----|
|2023|
| 25.8  | 2    | creating documentation and planning the project |
| 26.8  | 8    | designed sql database, started backend: created some graphql resolvers and session management, learning about session based authentication and options|
| 27.8 |   6 |    frontend basic functionality, login and signup. story writing form. small changes to backend to make frontend functionalities work
| 27.8 |   9 | story and chapter forms, storypage with chapter display and navigation, a lot of ui improvements, graphql resolver for adding chapters, learning about quillJS
| 28.8 | 11  | apollo cache updating when adding stories/chapters, refactored chapter navigation and story display, few ui improvements, added some validations for graphql resolvers, loading component to display while loading longer stories
| 29.8 | 11 | refactored story and chapterloading to lazyload next chapters instead of getting all at once, added notification component and context for noticications, started to work on user settings page|
| 30.8 | 8 | Refactored backend to remove repetitive code, commented code for readability, fixed frontend bugs found while testing some edge cases
| 31.8 | 7  | Refactored some frontend code, added usersettings functionality|
|   01.9 | 6     | Testing app, editing database for view and like counts
|   19.9 | 6     | Backend functionality for likes and read count
|   20.9 |  7     | Frontend functionality for liking chapters and displaying likes and read counts
|   23.9 |  4  | Frontend chapter navigation fixes, added component lazy loading to reduce initial file size
|   23.9 |  5    | All stories page, error handling and custom error component
|  24.9  |   11   | User profile page, backend functionality to retrieve user information, bug fixes and small improvements
| 29.10 | 8 | backend functionality for comments
| 31.10 | 10 | Comments, adding and deleting comments added to frontend, small improvements and bug fixes 
| 04.11 | 7 | More comment functionality, more validation for graphql resolvers and some simple spam detection/prevention
| 08.11 | 5 | Learning about spam prevention, edited spam detection to use Akismet for detecting spam
| 09.11 | 6 | Added google recaptcha v3 to detect bots, edited privacy policy and cookie consents to match added features
| 10.11 | 1 | Improved chapter reads tracking and edited privacy policy
|18.12| 12 | Added admin funcitonalities, added in memory cache for banned status, removed some repetitive code, fixed some bugs, edited database for some additional features
|20.12| 6 | Learning about redis, converted banned status cache and session storage to use redis
|21.12| 8 | Added seo friendly 404 page, added dark mode, deployed app to render for testing 
|28.12| 6 | Extensive testing of application on production environment. Writing documentation and updating old documentation.
| **Total hours for 2023** | **170** |  |
| **2024** |  |  |
|18.4 | 4 | Refactored and improved darkmode functionality, small fixes
|20.4 | 1 | Made darkmode toggle look nicer
|23.4 | 2 | Improved backend error handling to avoid backend crashes, testing
|25.4 | 6 | Refactored some forms, expanded darkmode functionality to every component and form, fixed bug with liking a chapter
|26.9| 7 | Fixed forms i broke earlier, replaced Akismet with simple spam detection, fixed a ton of bugs and a lot of useless console log spam, updated all packages, updated icon for website
|27.9| 12 | A lot more validation for user inputs, sanitizing user inputs, added csrf and allowed origins to protect graphql, changed front page to display most read stories in carousel and most recent ones in the grid, updated mysql tables, procedures and install script, automated frontend build in render
|7.10 | 10 | Fixed Quill character counter, improved genre selection on all stories page, added rate limiting for login attempts, hopefully fixed CSRF on production...
|13.10 | 6 | Restructuring frontend component organization and naming for better maintainability
|29.10 | 4 | Added user deletion for admins and updated privacy policy
|8.12| 4 | More testing, tidying up the code for submitting. Some work on documentation
| **Total hours for 2024** | **56** |  |
| **2025** |  |  |
|23.4| 5 | Switched from Quill to Tiptap due to broken character counter after update and better theming support. Separated text editor into its own component.
|29.4| 7 | Fixed broken notifications after Ant Design update, replaced static grecaptcha script and inline calls with reusable recaptcha utility.
|16.10| 4 | Added database initialization script to backend startup
|17.10| 10 | Dockerfile and docker-compose files for using Docker, Minor improvements. Testing Docker deployment. Rewriting documentation.
|19.10| 2 | Testing and bugfixes with using the app without reCaptcha
|23.10| 4 | Docker for development mode, updating documentation, small bug fixes
|    | 252    | 