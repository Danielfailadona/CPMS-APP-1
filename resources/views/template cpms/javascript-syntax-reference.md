# JavaScript Syntax Reference - CPMS Project

This document contains all JavaScript syntaxes and methods used throughout the Construction Project Management System (CPMS) with descriptions and proper usage examples.

## Table of Contents
1. [DOM Manipulation](#dom-manipulation)
2. [Event Handling](#event-handling)
3. [Form Handling](#form-handling)
4. [AJAX/Fetch Operations](#ajaxfetch-operations)
5. [Array Methods](#array-methods)
6. [Object Operations](#object-operations)
7. [Async/Await Operations](#asyncawait-operations)
8. [Console Operations](#console-operations)
9. [Window/Global Operations](#windowglobal-operations)
10. [Custom Functions](#custom-functions)

---

## DOM Manipulation

### document.getElementById()
**Description:** Gets a single HTML element by its ID attribute
**Syntax:** `const element = document.getElementById('elementId');`
**Example:**
```javascript
const form = document.getElementById('userForm');
const createBtn = document.getElementById('createBtn');
const usersList = document.getElementById('users-list');
```

### document.querySelector()
**Description:** Gets the first element that matches a CSS selector
**Syntax:** `const element = document.querySelector('selector');`
**Example:**
```javascript
const csrfToken = document.querySelector('input[name="_token"]')?.value;
const firstButton = document.querySelector('.btn');
```

### document.querySelectorAll()
**Description:** Gets all elements that match a CSS selector
**Syntax:** `const elements = document.querySelectorAll('selector');`
**Example:**
```javascript
document.querySelectorAll('.section').forEach(section => {
    section.style.display = 'none';
});
```

### element.innerHTML
**Description:** Gets or sets the HTML content inside an element
**Syntax:** `element.innerHTML = 'content';`
**Example:**
```javascript
usersList.innerHTML = '<p class="no-users">No users found.</p>';
usersList.innerHTML = usersHTML;
```

### element.value
**Description:** Gets or sets the value of form elements
**Syntax:** `element.value = 'newValue';`
**Example:**
```javascript
document.getElementById('name').value = user.name;
document.getElementById('password').value = '';
```

### element.checked
**Description:** Gets or sets the checked state of checkboxes/radio buttons
**Syntax:** `element.checked = true/false;`
**Example:**
```javascript
document.getElementById('is_authorized').checked = user.is_authorized;
document.getElementById('is_active').checked = true;
```

### element.style.display
**Description:** Controls the visibility of elements
**Syntax:** `element.style.display = 'value';`
**Example:**
```javascript
createBtn.style.display = 'none';
updateBtn.style.display = 'inline-block';
section.style.display = 'block';
```

### element.placeholder
**Description:** Sets placeholder text for input elements
**Syntax:** `element.placeholder = 'text';`
**Example:**
```javascript
document.getElementById('password').placeholder = 'Leave blank to keep current password';
```

### element.required
**Description:** Sets whether a form field is required
**Syntax:** `element.required = true/false;`
**Example:**
```javascript
document.getElementById('password').required = false;
```

---

## Event Handling

### addEventListener()
**Description:** Attaches an event handler to an element
**Syntax:** `element.addEventListener('event', function);`
**Example:**
```javascript
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    // Handle form submission
});

loadUsersBtn.addEventListener('click', loadUsers);
clearBtn.addEventListener('click', resetForm);
```

### e.preventDefault()
**Description:** Prevents the default action of an event
**Syntax:** `event.preventDefault();`
**Example:**
```javascript
form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form from submitting normally
});
```

### dispatchEvent()
**Description:** Triggers an event on an element
**Syntax:** `element.dispatchEvent(new Event('eventType'));`
**Example:**
```javascript
form.dispatchEvent(new Event('submit'));
```

---

## Form Handling

### new FormData()
**Description:** Creates a FormData object from a form element
**Syntax:** `const formData = new FormData(formElement);`
**Example:**
```javascript
const formData = new FormData(form);
const name = formData.get('name');
const email = formData.get('email');
```

### formData.get()
**Description:** Gets a value from FormData by field name
**Syntax:** `const value = formData.get('fieldName');`
**Example:**
```javascript
const password = formData.get('password');
const userType = formData.get('user_type');
```

### form.reset()
**Description:** Resets all form fields to their default values
**Syntax:** `formElement.reset();`
**Example:**
```javascript
function resetForm() {
    form.reset();
    currentEditingId = null;
}
```

---

## AJAX/Fetch Operations

### fetch()
**Description:** Makes HTTP requests to servers
**Syntax:** `fetch(url, options)`
**Example:**
```javascript
const response = await fetch('/logout', {
    method: 'POST',
    headers: {
        'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
        'X-Requested-With': 'XMLHttpRequest'
    }
});
```

### response.json()
**Description:** Parses response body as JSON
**Syntax:** `const data = await response.json();`
**Example:**
```javascript
const response = await fetch(this.baseUrl);
const result = await response.json();
```

---

## Array Methods

### array.map()
**Description:** Creates a new array by transforming each element
**Syntax:** `const newArray = array.map(item => transformation);`
**Example:**
```javascript
const usersHTML = users.map(user => `
    <div class="user-item" data-id="${user.id}">
        <strong>${user.name}</strong>
    </div>
`).join('');
```

### array.join()
**Description:** Joins array elements into a string
**Syntax:** `const string = array.join('separator');`
**Example:**
```javascript
const htmlString = htmlArray.join('');
```

### array.forEach()
**Description:** Executes a function for each array element
**Syntax:** `array.forEach(item => { /* code */ });`
**Example:**
```javascript
document.querySelectorAll('.section').forEach(section => {
    section.style.display = 'none';
});
```

### array.filter()
**Description:** Creates a new array with elements that pass a test
**Syntax:** `const filtered = array.filter(item => condition);`
**Example:**
```javascript
const userUploads = uploads.filter(upload => upload.user_id == currentUserId);
```

### array.find()
**Description:** Returns the first element that matches a condition
**Syntax:** `const item = array.find(item => condition);`
**Example:**
```javascript
const foreman = users.find(user => user.id == task.foreman_id);
```

---

## Object Operations

### Object Property Access
**Description:** Access object properties using dot notation or brackets
**Syntax:** `object.property` or `object['property']`
**Example:**
```javascript
const userName = user.name;
const userType = user.user_type;
const isAuthorized = user.is_authorized;
```

### Object Creation
**Description:** Create objects using object literal syntax
**Syntax:** `const obj = { key: value };`
**Example:**
```javascript
const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    user_type: formData.get('user_type'),
    is_authorized: formData.get('is_authorized') ? true : false
};
```

---

## Async/Await Operations

### async function
**Description:** Declares an asynchronous function
**Syntax:** `async function functionName() { }`
**Example:**
```javascript
async function loadUsers() {
    const users = await userCrud.readAll();
}
```

### await
**Description:** Waits for a Promise to resolve
**Syntax:** `const result = await promiseFunction();`
**Example:**
```javascript
const result = await userCrud.readOne(id);
const users = await userCrud.readAll();
```

### try/catch
**Description:** Handles errors in async operations
**Syntax:** `try { } catch (error) { }`
**Example:**
```javascript
try {
    const result = await userCrud.create(data);
    if (result.success) {
        showSuccess(result.message);
    }
} catch (error) {
    console.error('Error:', error);
    showError('Error processing request');
}
```

---

## Console Operations

### console.log()
**Description:** Outputs messages to the browser console
**Syntax:** `console.log('message', variable);`
**Example:**
```javascript
console.log('CRUD helpers initialized');
console.log('Users loaded:', users);
```

### console.error()
**Description:** Outputs error messages to the console
**Syntax:** `console.error('error message', error);`
**Example:**
```javascript
console.error('Error loading users:', error);
```

---

## Window/Global Operations

### window.functionName
**Description:** Makes functions globally accessible
**Syntax:** `window.functionName = function() { };`
**Example:**
```javascript
window.editUser = async function(id) {
    // Function code
};
window.deleteUser = async function(id) {
    // Function code
};
```

### window.location.href
**Description:** Redirects to a different URL
**Syntax:** `window.location.href = 'url';`
**Example:**
```javascript
window.location.href = '/login';
```

### setTimeout()
**Description:** Executes code after a delay
**Syntax:** `setTimeout(function, milliseconds);`
**Example:**
```javascript
setTimeout(() => {
    window.location.href = '/login';
}, 1500);
```

---

## Custom Functions

### CrudHelper Class
**Description:** Custom class for database operations
**Syntax:** `const crud = new CrudHelper('tableName');`
**Example:**
```javascript
const userCrud = new CrudHelper('users');
const uploadCrud = new CrudHelper('uploads');

// Usage
const users = await userCrud.readAll();
const result = await userCrud.create(data);
const updateResult = await userCrud.update(id, data);
```

### Custom Popup Functions
**Description:** Custom functions for styled popups
**Syntax:** `showSuccess('message');`
**Example:**
```javascript
showSuccess('User created successfully!');
showError('Something went wrong.');
showInfo('User details information');
showConfirmPopup('Title', 'Message', yesCallback, noCallback);
```

### Password Validation Functions
**Description:** Custom functions for password validation
**Syntax:** `validatePasswordStrength(password);`
**Example:**
```javascript
function validatePasswordStrength(password) {
    if (password.length < 9) {
        showError('Password must be at least 9 characters long');
        return false;
    }
    return true;
}

function validatePasswordMatch(password, confirmPassword) {
    return password === confirmPassword;
}
```

---

## Common Patterns Used in CPMS

### 1. DOM Ready Pattern
```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize code here
});
```

### 2. Form Submission Pattern
```javascript
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    // Process form data
});
```

### 3. CRUD Operation Pattern
```javascript
try {
    const result = await crudHelper.operation(data);
    if (result.success) {
        showSuccess(result.message);
        refreshData();
    } else {
        showError('Error: ' + result.message);
    }
} catch (error) {
    showError('Error processing request');
}
```

### 4. Dynamic HTML Generation Pattern
```javascript
const htmlString = dataArray.map(item => `
    <div class="item" data-id="${item.id}">
        <span>${item.name}</span>
        <button onclick="editItem(${item.id})">Edit</button>
    </div>
`).join('');
element.innerHTML = htmlString;
```

### 5. Section Navigation Pattern
```javascript
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    // Show target section
    document.getElementById(sectionName + '-section').style.display = 'block';
}
```

---

## Variable Naming Conventions Used

- **Elements:** `const elementName = document.getElementById('element-id');`
- **CRUD Helpers:** `const tableCrud = new CrudHelper('table_name');`
- **Form Data:** `const formData = new FormData(form);`
- **API Results:** `const result = await apiCall();`
- **HTML Strings:** `const itemsHTML = items.map(...).join('');`
- **Boolean Flags:** `let isEditing = false;`
- **Current State:** `let currentEditingId = null;`

---

## Additional Syntaxes Found in CPMS

### Camera/Media API

#### navigator.mediaDevices.getUserMedia()
**Description:** Accesses device camera/microphone
**Syntax:** `const stream = await navigator.mediaDevices.getUserMedia(constraints);`
**Example:**
```javascript
cameraStream = await navigator.mediaDevices.getUserMedia({ 
    video: { facingMode: 'environment' }
});
```

#### canvas.getContext()
**Description:** Gets drawing context for canvas element
**Syntax:** `const ctx = canvas.getContext('2d');`
**Example:**
```javascript
const canvas = document.getElementById('camera-canvas');
const ctx = canvas.getContext('2d');
ctx.drawImage(video, 0, 0);
```

#### canvas.toBlob()
**Description:** Converts canvas content to blob
**Syntax:** `canvas.toBlob(callback, type, quality);`
**Example:**
```javascript
canvas.toBlob(function(blob) {
    photoBlob = blob;
}, 'image/jpeg', 0.8);
```

#### URL.createObjectURL()
**Description:** Creates URL for blob objects
**Syntax:** `const url = URL.createObjectURL(blob);`
**Example:**
```javascript
const url = URL.createObjectURL(blob);
previewImg.src = url;
URL.revokeObjectURL(url); // Clean up
```

### File Handling

#### fileInput.files
**Description:** Gets files from file input element
**Syntax:** `const file = fileInput.files[0];`
**Example:**
```javascript
const fileInput = document.getElementById('file');
const file = fileInput.files[0];
if (!file) {
    alert('Please select a file');
}
```

#### response.blob()
**Description:** Gets response body as blob
**Syntax:** `const blob = await response.blob();`
**Example:**
```javascript
const response = await fetch('/download-file');
const blob = await response.blob();
```

#### document.createElement()
**Description:** Creates new HTML elements
**Syntax:** `const element = document.createElement('tagName');`
**Example:**
```javascript
const a = document.createElement('a');
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
```

### String Methods

#### string.includes()
**Description:** Checks if string contains substring
**Syntax:** `string.includes(searchString)`
**Example:**
```javascript
if (upload.title && upload.title.toLowerCase().includes(searchTerm)) {
    // Match found
}
```

#### string.toLowerCase()
**Description:** Converts string to lowercase
**Syntax:** `const lower = string.toLowerCase();`
**Example:**
```javascript
const searchTerm = document.getElementById('search-files').value.toLowerCase();
```

#### string.toUpperCase()
**Description:** Converts string to uppercase
**Syntax:** `const upper = string.toUpperCase();`
**Example:**
```javascript
${task.priority.toUpperCase()}
```

#### string.replace()
**Description:** Replaces parts of a string
**Syntax:** `const newStr = string.replace(searchValue, replaceValue);`
**Example:**
```javascript
${task.status.replace('_', ' ').toUpperCase()}
```

#### string.charAt()
**Description:** Gets character at specific index
**Syntax:** `const char = string.charAt(index);`
**Example:**
```javascript
${action.charAt(0).toUpperCase() + action.slice(1)}
```

#### string.slice()
**Description:** Extracts part of a string
**Syntax:** `const part = string.slice(start, end);`
**Example:**
```javascript
photoTimestamp.toISOString().slice(0, 19).replace('T', ' ')
```

### Date Methods

#### new Date()
**Description:** Creates date objects
**Syntax:** `const date = new Date();`
**Example:**
```javascript
photoTimestamp = new Date();
resolved_at: new Date().toISOString()
```

#### date.toLocaleDateString()
**Description:** Formats date as local date string
**Syntax:** `const dateStr = date.toLocaleDateString();`
**Example:**
```javascript
${new Date(upload.created_at).toLocaleDateString()}
```

#### date.toLocaleString()
**Description:** Formats date as local date/time string
**Syntax:** `const dateTimeStr = date.toLocaleString();`
**Example:**
```javascript
${photoTimestamp.toLocaleString()}
```

#### date.toISOString()
**Description:** Formats date as ISO string
**Syntax:** `const isoStr = date.toISOString();`
**Example:**
```javascript
resolved_at: new Date().toISOString()
```

### Math Methods

#### Math.floor()
**Description:** Rounds down to nearest integer
**Syntax:** `const rounded = Math.floor(number);`
**Example:**
```javascript
const i = Math.floor(Math.log(bytes) / Math.log(k));
```

#### Math.log()
**Description:** Returns natural logarithm
**Syntax:** `const log = Math.log(number);`
**Example:**
```javascript
Math.log(bytes) / Math.log(k)
```

#### Math.pow()
**Description:** Returns base to the exponent power
**Syntax:** `const result = Math.pow(base, exponent);`
**Example:**
```javascript
(bytes / Math.pow(k, i)).toFixed(2)
```

### Number Methods

#### number.toFixed()
**Description:** Formats number with fixed decimal places
**Syntax:** `const fixed = number.toFixed(digits);`
**Example:**
```javascript
parseFloat((bytes / Math.pow(k, i)).toFixed(2))
```

#### parseFloat()
**Description:** Parses string and returns floating point number
**Syntax:** `const float = parseFloat(string);`
**Example:**
```javascript
parseFloat((bytes / Math.pow(k, i)).toFixed(2))
```

### Popup System (Custom)

#### UniversalPopup Class
**Description:** Custom popup system for styled alerts
**Syntax:** `const popup = new UniversalPopup();`
**Example:**
```javascript
class UniversalPopup {
    showSuccess(message) {
        this.showOK('Success', message, 'success');
    }
}
```

#### document.body.insertAdjacentHTML()
**Description:** Inserts HTML at specified position
**Syntax:** `element.insertAdjacentHTML(position, html);`
**Example:**
```javascript
document.body.insertAdjacentHTML('beforeend', popupHTML);
```

### Event Object Properties

#### event.target
**Description:** Gets the element that triggered the event
**Syntax:** `const target = event.target;`
**Example:**
```javascript
if (e.target === popup) {
    this.hide();
}
event.target.classList.add('active');
```

#### event.key
**Description:** Gets the key that was pressed
**Syntax:** `const key = event.key;`
**Example:**
```javascript
if (e.key === 'Enter') loadUploads(true);
```

### Element Properties

#### element.textContent
**Description:** Gets or sets text content of element
**Syntax:** `element.textContent = 'text';`
**Example:**
```javascript
submitTaskBtn.textContent = 'Sending...';
titleElement.textContent = title;
```

#### element.disabled
**Description:** Gets or sets disabled state of form elements
**Syntax:** `element.disabled = true/false;`
**Example:**
```javascript
uploadBtn.disabled = true;
event.target.disabled = true;
```

#### element.srcObject
**Description:** Sets media source for video elements
**Syntax:** `videoElement.srcObject = stream;`
**Example:**
```javascript
const video = document.getElementById('camera-video');
video.srcObject = cameraStream;
```

#### element.src
**Description:** Gets or sets source URL for media elements
**Syntax:** `element.src = 'url';`
**Example:**
```javascript
previewImg.src = URL.createObjectURL(blob);
```

#### element.href
**Description:** Gets or sets hyperlink reference
**Syntax:** `element.href = 'url';`
**Example:**
```javascript
const a = document.createElement('a');
a.href = url;
a.download = filename;
```

### Stream Methods

#### stream.getTracks()
**Description:** Gets all tracks from media stream
**Syntax:** `const tracks = stream.getTracks();`
**Example:**
```javascript
if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
}
```

### Conditional (Ternary) Operator

#### condition ? value1 : value2
**Description:** Shorthand for if-else statements
**Syntax:** `const result = condition ? valueIfTrue : valueIfFalse;`
**Example:**
```javascript
const action = currentlyActive ? 'deactivate' : 'activate';
const publicStatus = upload.is_public ? 'Public' : 'Private';
${task.due_date ? `<span>Due: ${date}</span>` : ''}
```

### Template Literals

#### Backtick strings with ${}
**Description:** String interpolation with embedded expressions
**Syntax:** `` `string ${expression} string` ``
**Example:**
```javascript
const filename = `photo_${Date.now()}.jpg`;
const html = `<div class="item">${item.name}</div>`;
```

### Logical Operators

#### && (AND)
**Description:** Logical AND operator
**Syntax:** `condition1 && condition2`
**Example:**
```javascript
if (upload.title && upload.title.toLowerCase().includes(searchTerm)) {
    // Both conditions must be true
}
```

#### || (OR)
**Description:** Logical OR operator
**Syntax:** `condition1 || condition2`
**Example:**
```javascript
const title = upload.title || upload.filename;
const message = result.message || 'Unknown error';
```

#### ! (NOT)
**Description:** Logical NOT operator
**Syntax:** `!condition`
**Example:**
```javascript
if (!file) {
    alert('Please select a file');
}
```

### Comparison Operators

#### == (Equality)
**Description:** Compares values for equality (with type coercion)
**Syntax:** `value1 == value2`
**Example:**
```javascript
const userTasks = tasks.filter(task => task.worker_id == currentUserId);
```

#### === (Strict Equality)
**Description:** Compares values for equality (without type coercion)
**Syntax:** `value1 === value2`
**Example:**
```javascript
if (newTitle === null) return;
if (complaint.status === 'resolved') {
    // Show delete button
}
```

#### !== (Strict Inequality)
**Description:** Compares values for inequality (without type coercion)
**Syntax:** `value1 !== value2`
**Example:**
```javascript
if (typeFilter !== 'all') {
    uploads = uploads.filter(upload => upload.upload_type === typeFilter);
}
```

This reference covers all the JavaScript syntaxes and patterns used throughout the CPMS project. Each syntax includes its purpose, proper usage, and real examples from the codebase.