# ThePlotPot
## Objective  
"ThePlotPot" is a collaborative story-writing platform where users contribute to ongoing stories by adding branches or chapters. Through community voting, stories evolve in various directions, enabling a myriad of narrative possibilities.

## Core Features

#### User Profiles:
* Sign up and log in.
* Display the user's stories and contributions.
#### Story Creation:
* Any user can start a new story by writing the initial chapter.
* Title, genre and content for each story/chapter.
#### Collaborative Writing:
* After an initial chapter is posted, users can suggest continuations for a set number of branches by writing a next chapter (e.g., two or three).
* For each chapter, the system should show a branching option, allowing users to either continue Branch 1 or Branch 2.
#### Story Viewing:
* Stories can be read linearly.
* At the end of each chapter, readers are presented with options to explore each branch.
#### Commenting (Optional):
* Readers can leave comments or feedback on each chapter.

## Technical Requirements

#### Backend

##### Database MySQL
* users table: Store user data, including login details and profile information.
* stories table: Store individual stories with reference to its author.
* chapters table: Storing individual chapters, with references to parent chapters and their respective branches.

##### Cache Database REDIS
* Sessions: stores user session data
* Bannedusers cache: To limit queries to main database backend queries cache for every user action requiring authentication to check if user is banned or not.

##### GraphQL Schema
* Queries: Fetch user details, stories, chapters, and comments.
* Mutations: Add or update user details, stories, chapters, upvotes, and comments.
* Subscriptions: Real-time updates when a new chapter is added or when a chapter gets upvotes.

#### Frontend
* React for building the UI components.
* QuillJS for the rich text editor interface.
* Apollo Client to handle GraphQL requests.

#### Authentication
* Basic authentication system using GraphQL and Apollo.
* Secure sign-up, login, and session management.

## Challenges and Constraints
* Maintaining content quality. -> Bot detection with Google Recaptcha v3 and spam detection with Akismet.
* Managing spam contributions and ensuring platform integrity. -> Admins are able to delete stories, chapters and comments, ban, unban and delete users.
## Future Scope 
* Implementation of user profiles with more details and achievements.
* Introduction of a tree view to visualize story progression.
* Enhanced collaborative editing and real-time interactions.