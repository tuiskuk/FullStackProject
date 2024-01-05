# FullStackProject - **Dishcovery**


**Santeri Ora, Otso Tikkanen and Tuisku Kaikuvuo**

## Description of the project

Dishcovery is a powerful and interactive web application designed to simplify the process of discovering recipes that suit users' needs.
With its versatile search functionality and large recipe collection, you can always find recipes for your needs. On top of that, Dishcovery has been expanded into a social media app for recipes.

### Key Features
- Extensive Recipe Collection from the Edamam API
- Comprehensive recipe search
- User registration and profiles
- User profiles and following
- Recipe creation
- Interactive recipe engagement (likes and comments)

### Production
Link to the production version: [https://dishcovery-nimz.onrender.com/](https://dishcovery-nimz.onrender.com/)

The production version might take some time (5-10 minutes) to run due to the free backend and frontend hosting in Render: [https://render.com/](https://render.com/).

Known issue (only in production): Because of limitations of Render's free version and non-persistent disk, after uploading images succesfully, they won't be saved after refreshing or after new deployments etc. Persistent images work in local versions and have the correct logic but bear this limitation in mind when using the application.


### Individual Work Areas
Overall, we didn't have typical designated working areas in the project, such as backend or frontend assignments. Instead, we viewed the project as an opportunity to delve deeper into full-stack development, exploring various technologies and showcasing our skills in this domain. Our group dynamics were excellent; we extensively discussed the project on Discord and consistently assisted each other in resolving various challenges. Below, we've outlined the primary work areas for each team member:

- **Santeri Ora** \
Santeri primarily focused on working with the recipe API, developing recipe search pages for both API and user-generated recipes. He handled backend tasks related to the recipe API and managed the recipe database. Additionally, he was responsible for various dialogs, UI components, and their associated logics.

- **Otso Tikkanen** \
Otso's primary area of work revolved around backend functionalities concerning user management. He also managed the create recipe page and the frontend display of recipes. He oversaw the integration of user-generated recipes with the API in the backend and database. Furthermore, Otso took care of saving and displaying images of users and their recipes. He also worked with the responsiveness of the app.

- **Tuisku Kaikuvuo** \
Tuisku worked on setting up Redux and RTK query at the start and then mainly on functionalities relating to users and users' profiles. Examples are jwt logic and logging in, following, seeing other users' profiles and people following them et cetera.

### Hours
documented project hours: [https://github.com/tuiskuk/FullStackProject/blob/main/hours.md](https://github.com/tuiskuk/FullStackProject/blob/main/hours.md)


### Instructions
- Open the app in your browser using the provided URL.
- Upon reaching the app's homepage, take a moment to familiarize yourself with the layout and design.
- Navigate the app by using the buttons available in the navigation bar.
- To access additional functionalities, locate the login option on the right side of the navigation bar.
- If you prefer not to register at the moment, you can use the example user account provided.
- Once you've logged in, a new world of functionalities opens up:
   - You can now create your own recipes and contribute to the community.
   - Interact with recipes by liking and commenting on them.
   - Begin following other users. Likewise, other users can now follow your profile, explore your profile, view your recipes, and more.


**Example user** \
**email:** test.test@gmail.com \
**password:** 12345678


**Warning** \
The page may sometimes lack information about recipes due to the limitation of api calls (10 calls/min in the free version)

### Usage and information about the project
Check the readme files in the frontend and backend folders for more information about the technologies used and local setup of this project.

### API
**Edamam Recipe Search API**\
[https://developer.edamam.com/edamam-recipe-api](https://developer.edamam.com/edamam-recipe-api)

### Navigation diagram with functionalities
![image](https://github.com/tuiskuk/FullStackProject/assets/124632924/f5d54fc1-d87b-4990-8c39-de06283b69b9)
