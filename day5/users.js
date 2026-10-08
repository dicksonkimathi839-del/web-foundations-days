const API_URL = "https://jsonplaceholder.typicode.com/users";

const loadUsersButton = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const status = document.getElementById("status");
const usersList = document.getElementById("users-list");

let users = [];
let usersLoaded = false;


/**
 * Loads users from the REST API.
 */
async function loadUsers() {
    loadUsersButton.disabled = true;
    filterInput.disabled = true;

    status.textContent = "Loading users...";
    usersList.replaceChildren();

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                `Request failed with status ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid user data received from the API.");
        }

        users = data;
        usersLoaded = true;

        filterInput.disabled = false;

        renderUsers(users);

        status.textContent =
            `Successfully loaded ${users.length} users.`;

    } catch (error) {
        users = [];
        usersLoaded = false;

        filterInput.value = "";
        filterInput.disabled = true;

        usersList.replaceChildren();

        status.textContent =
            "Unable to load users. Please try again later.";

        console.error("Error loading users:", error);

    } finally {
        loadUsersButton.disabled = false;
    }
}


/**
 * Renders any supplied array of users.
 *
 * @param {Array} list - Array of users to display.
 */
function renderUsers(list) {
    usersList.replaceChildren();

    list.forEach((user) => {
        const listItem = document.createElement("li");

        const name = document.createElement("h3");
        name.textContent = user.name;

        const email = document.createElement("p");
        email.textContent = `Email: ${user.email}`;

        const city = document.createElement("p");
        city.textContent = `City: ${user.address.city}`;

        const company = document.createElement("p");
        company.textContent = `Company: ${user.company.name}`;

        listItem.appendChild(name);
        listItem.appendChild(email);
        listItem.appendChild(city);
        listItem.appendChild(company);

        usersList.appendChild(listItem);
    });
}


/**
 * Filters the already-loaded users by name.
 */
function filterUsers() {
    if (!usersLoaded) {
        return;
    }

    const searchText = filterInput.value.trim().toLowerCase();

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchText)
    );

    renderUsers(filteredUsers);

    if (searchText === "") {
        status.textContent =
            `Showing all ${users.length} users.`;
        return;
    }

    if (filteredUsers.length === 0) {
        status.textContent = "No users match your filter.";
        return;
    }

    status.textContent =
        `Showing ${filteredUsers.length} matching user${
            filteredUsers.length === 1 ? "" : "s"
        }.`;
}


/**
 * Load users when the button is clicked.
 */
loadUsersButton.addEventListener("click", loadUsers);


/**
 * Filter the existing users whenever the input changes.
 */
filterInput.addEventListener("input", filterUsers);