const loadUsersButton = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const status = document.getElementById("status");
const usersList = document.getElementById("users-list");

const API_URL = "https://jsonplaceholder.typicode.com/users";
let users = [];

async function loadUsers() {
    loadUsersButton.disabled = true;
    status.textContent = "Loading users...";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        users = await response.json();

        renderUsers(users);

        status.textContent = `Successfully loaded ${users.length} users.`;
    } catch (error) {
        users = [];
        usersList.innerHTML = "";
        status.textContent =
            "Unable to load users. Please try again later.";
    } finally {
        loadUsersButton.disabled = false;
    }
}

function renderUsers(list) {
    usersList.innerHTML = "";

    if (list.length === 0) {
        if (filterInput.value.trim() !== "") {
            status.textContent = "No users match your filter.";
        }

        return;
    }

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

filterInput.addEventListener("input", () => {
    const searchText = filterInput.value.trim().toLowerCase();

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchText)
    );

    renderUsers(filteredUsers);

    if (filteredUsers.length > 0) {
        status.textContent =
            `Showing ${filteredUsers.length} user${filteredUsers.length === 1 ? "" : "s"}.`;
    } else if (searchText !== "") {
        status.textContent = "No users match your filter.";
    } else {
        status.textContent = "No users loaded.";
    }
});

loadUsersButton.addEventListener("click", loadUsers);