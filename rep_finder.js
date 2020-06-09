var listener = document.getElementById("get");


var Url = "https://api.github.com/users/{user}/repos";

var repos = [];

listener.addEventListener("click", loadRepos);

async function loadRepos() {
    let user = document.getElementById("user").value;

    document.getElementById("repos-title").textContent = `${user}'s repositories:`;

    let url = Url.replace("{user}", user);

    let response = await fetch(url)
    repos  = await response.json();

    document.getElementById("repos").innerHTML = "";

    for (let i = 0; i < repos.length; i++) {
        let divForRep = document.createElement("div");
        
        divForRep.innerHTML = `<div class="form-group">${repos[i].name}</div>`;

        divForRep.addEventListener("click", () => loadRepoData(i));

        document.getElementById("repos").appendChild(divForRep);
    }
}

function loadRepoData(index) {
    let repo = repos[index];
    document.getElementById("info").innerHTML += `<h3>Languages</h3>`;
    document.getElementById("title").innerHTML += `<h2>Name of the repository:  ${repo.name}</h2>`;
    
    document.getElementById("info").innerHTML = "";

    document.getElementById("info").innerHTML += `<h3>Description of repository:</h3>\n<p>${repo.description}</p>`;
    document.getElementById("info").innerHTML += `<h3>URL:</h3>\n<p>${repo.url}</p>`;
    document.getElementById("info").innerHTML += `<h3>Created at:</h3>\n<p>${repo.created_at}</p>`;
    document.getElementById("info").innerHTML += `<h3>Last update at:</h3>\n<p>${repo.updated_at}</p>`;

    loadLanguageData(index);

    loadCommitData(index);
   
}

async function loadLanguageData(index) {
    let url = repos[index].languages_url;

    let response =await fetch(url);

    let languages = await response.json();

    

    document.getElementById("info").innerHTML += `<h3>Languages</h3>`;

    let ul = document.createElement('ul');
    ul.className ="list-group";

    for (const lang in languages) {
        
        ul.innerHTML += `<li class="list-group-item">${lang}</li>`;
    }

    document.getElementById("info").appendChild(ul);
}

async function loadCommitData(index) {
    let url = repos[index].commits_url.replace("{/sha}", "");

    let response = await fetch(url);

    let commits = await response.json();

    document.getElementById("info").innerHTML += `<h3>Commits of repo</h3>`;

    let commitTable = document.createElement('table');
    commitTable.id = "commit-table";
    commitTable.className ="table";

    let tableDiv = document.createElement("div");
    tableDiv.id = "table-container";

    let th_row = document.createElement("tr");
    th_row.innerHTML = "<th>Hash</th><th>Message</th><th>Date</th>";

    commitTable.appendChild(th_row);

    commits.forEach(commit => {
        let tr = document.createElement("tr");

        let hash = commit.sha.slice(0, 6);
        let message = commit.commit.message;
        let date = new Date(commit.commit.committer.date);
        let dateStr = date.toDateString();
        let timeStr = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        tr.innerHTML += `<td>${hash}</td>\n`;
        tr.innerHTML += `<td>${message}</td>\n`;
        tr.innerHTML += `<td>${dateStr}, ${timeStr}</td>\n`;

        commitTable.appendChild(tr);
    });

    tableDiv.appendChild(commitTable);

    document.getElementById("info").appendChild(tableDiv);
}