import { apiUrl } from './settings.js';
import { getData } from './fetch.js';
import { validate } from './validation.js';

//Keys of users. 
let keys = ["id", "name", "emailAddress", "address"];
let editMode = false;

//START
//GET data from the server

const getUsers = () => {
getData(apiUrl).then(
  data => fillDataTable(data.reverse(), "userTable"),
  );
}

getUsers();

//Fill table with server data 
const fillDataTable = (data, tableID) => {
    let table = document.querySelector(`#${tableID}`);
    if (!table) {
      console.error(`Table "${tableID}" is not found.`);
      return;
    }

    // Add new user row to the table
    let tBody = table.querySelector("tbody");
    tBody.innerHTML = "";
    let newRow = newUserRow();
    tBody.appendChild(newRow);

    for (let row of data) {
      let tr = createAnyElement("tr");
      for (let k of keys) {
        let td = createAnyElement("td");
        td.innerHTML = row[k];  
        tr.appendChild(td);
      }
      let btnGroup = createBtnGroup();
      tr.appendChild(btnGroup);
      tBody.appendChild(tr);
    }
}

const createAnyElement = (name, attributes) => {
  let element = document.createElement(name);
  for (let k in attributes) {
    element.setAttribute(k, attributes[k]);
  };
  
  return element;
}


// Create buttons 
const createBtnGroup = () => {
  let group = createAnyElement("div", {class: "btn btn-group"});
  let editBtn = createAnyElement("button", {class: "btn btn-edit"});
  editBtn.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';
  editBtn.addEventListener('click', function() {
    editUser(this);
  });
  
  let delBtn = createAnyElement("button", {class: "btn btn-delete"});
  delBtn.addEventListener('click', function() {
    deleteUser(this);
  });
  delBtn.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
  
  group.appendChild(editBtn);
  group.appendChild(delBtn);

  let td = createAnyElement("td");
  td.appendChild(group);
  
  return td;
}

// Delete button  

function deleteUser(btn) {
  let tr = btn.parentElement.parentElement.parentElement;
  let id = tr.querySelector("td:first-child").innerHTML;
  let fetchOptions = {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache"
  };

  fetch(`${apiUrl}/${id}`, fetchOptions).then(
    resp => resp.json(),
    err => console.error(err) ).then(
      data => {
        getUsers();
      }
    );
}


// Create new user
function newUserRow(row) {
  let tr = createAnyElement("tr");
  for (let k of keys) {
    let td = createAnyElement("td");
    let input = createAnyElement("input", {
      class: "input",
      name: k
    });
    td.appendChild(input);
    tr.appendChild(td);
  }
  let newBtn = createAnyElement("button", {
    class: "btn btn-new",
  });
  newBtn.innerHTML = '<i class="fa fa-plus" aria-hidden="true"></i>';
  newBtn.addEventListener('click', function() {
    createUser(this);
  });
  let td = createAnyElement("td");
  td.appendChild(newBtn);
  tr.appendChild(td);

  return tr;
}

const createUser = (btn) => {
  let tr = btn.parentElement.parentElement;
  let data = getRowData(tr);
  delete data.id;
  let fetchOptions = {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  fetch(`${apiUrl}`, fetchOptions).then(
    resp => resp.json(),
    error => console.error(error)
  ).then(
    data => getUsers()
  );
};

function getRowData(tr) {
  let inputs = tr.querySelectorAll('input');
  let data = {};
  for (let i = 0; i<inputs.length; i++) {
    data[inputs[i].name] = inputs[i].value;
  }
  return data;
};

// Edit row
const filldatarow = (tr, data) => {
  tr.innerHTML = '';
  for (let k of keys) {
    let td = createAnyElement('td');
    let input = createAnyElement("input", {
            class: "form-control",
            value: data[k]
          });
    input.setAttribute('name', k);
    if (k === 'id') input.setAttribute('readonly', 'true');
    td.appendChild(input);
    tr.appendChild(td);
  }
  
  const btnGroup = createBtnGroup('Save', 'Cancel');
  tr.appendChild(btnGroup);

  return tr;
};

const editUser = (btn) => {
  editMode = true;
  const tr = btn.parentElement.parentElement.parentElement;
  const data = getRowData(tr);

  return filldatarow(tr, data);
};

// Validation