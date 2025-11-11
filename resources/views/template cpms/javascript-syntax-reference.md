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
**Description:** Custom class for database operations with Laravel model validation
**Syntax:** `const crud = new CrudHelper('tableName');`
**Example:**
```javascript
const userCrud = new CrudHelper('users');
const uploadCrud = new CrudHelper('uploads');
const productCrud = new CrudHelper('products'); // Now with validation!

// Usage
const users = await userCrud.readAll();
const result = await userCrud.create(data);
const updateResult = await userCrud.update(id, data);

// Products now use Laravel validation automatically
const product = await productCrud.create({
    name: 'Safety Helmet',
    price: 29.99,
    category: 'Safety Equipment',
    stock_quantity: 100
});
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

### 3. CRUD Operation Pattern (with Validation)
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

### 3a. CRUD Validation Error Handling Pattern
```javascript
try {
    const result = await productCrud.create(data);
    if (result.success) {
        showSuccess(result.message);
    } else {
        // Handle validation errors
        if (result.errors) {
            Object.keys(result.errors).forEach(field => {
                showError(`${field}: ${result.errors[field][0]}`);
            });
        } else {
            showError(result.message);
        }
    }
} catch (error) {
    showError('Network error occurred');
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

### Animation-Related Syntaxes

#### element.classList.add()
**Description:** Adds CSS classes to elements for animations
**Syntax:** `element.classList.add('className');`
**Example:**
```javascript
element.classList.add('section-show');
button.classList.add('active');
```

#### element.classList.remove()
**Description:** Removes CSS classes from elements
**Syntax:** `element.classList.remove('className');`
**Example:**
```javascript
buttons.forEach(btn => {
    btn.classList.remove('active');
});
```

#### element.classList.toggle()
**Description:** Toggles CSS classes on elements
**Syntax:** `element.classList.toggle('className');`
**Example:**
```javascript
dropdown.classList.toggle('show');
panel.classList.toggle('panel-transition');
```

#### CSS Animation Properties
**Description:** CSS properties that control animations
**Syntax:** Various CSS animation properties
**Example:**
```css
.container {
    animation: fadeInUp 0.8s ease-out;
}

.sidebar {
    animation: slideInLeft 0.6s ease-out;
}

.popup-box {
    animation: popupSlideIn 0.4s ease-out;
}
```

#### CSS Transform Properties
**Description:** CSS properties for element transformations
**Syntax:** Various transform values
**Example:**
```css
.btn:hover {
    transform: translateY(-2px);
}

.popup-box {
    transform: scale(1) translateY(0);
}
```

#### CSS Transition Properties
**Description:** CSS properties for smooth transitions
**Syntax:** Various transition values
**Example:**
```css
.btn {
    transition: all 0.3s ease;
}

.toggle-btn {
    transition: transform 0.2s ease;
}
```

#### Animation Keyframes
**Description:** CSS keyframe definitions for custom animations
**Syntax:** `@keyframes animationName { }`
**Example:**
```css
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes bounceIn {
    0% {
        opacity: 0;
        transform: scale(0.3);
    }
    50% {
        opacity: 1;
        transform: scale(1.1);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}
```

#### Animation Delay Properties
**Description:** CSS properties to stagger animations
**Syntax:** `animation-delay: time;`
**Example:**
```css
.menu li:nth-child(1) { animation-delay: 0.1s; }
.menu li:nth-child(2) { animation-delay: 0.2s; }
.form-row:nth-child(1) .input-group { animation-delay: 0.1s; }
```

#### Animation Fill Mode
**Description:** CSS property to control animation state
**Syntax:** `animation-fill-mode: both;`
**Example:**
```css
.main-content {
    animation: fadeInRight 0.8s ease-out 0.2s both;
}

.profile {
    animation: bounceIn 0.8s ease-out 0.3s both;
}
```

### Panel Transition Functions

#### showRegister()
**Description:** Function to show registration panel with animations
**Syntax:** `showRegister();`
**Example:**
```javascript
function showRegister() {
    const leftPanel = document.getElementById('left-panel');
    const rightPanel = document.getElementById('right-panel');
    // Panel content switching with animations
}
```

#### showLogin()
**Description:** Function to show login panel with animations
**Syntax:** `showLogin();`
**Example:**
```javascript
function showLogin() {
    const leftPanel = document.getElementById('left-panel');
    const rightPanel = document.getElementById('right-panel');
    // Panel content switching with animations
}
```

### Animation Event Handlers

#### Button Active State Management
**Description:** Managing active states for animated buttons
**Syntax:** Button state management pattern
**Example:**
```javascript
buttons.forEach(button => {
    button.addEventListener('click', function() {
        buttons.forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
    });
});
```

#### Section Show Animation
**Description:** Function to show sections with animations
**Syntax:** `showSection(sectionName);`
**Example:**
```javascript
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('section-show');
    }
}
```

### Laravel Model Validation Integration

#### Validation Error Response Handling
**Description:** Handling Laravel validation errors from API responses
**Syntax:** `if (result.errors) { /* handle validation errors */ }`
**Example:**
```javascript
const result = await productCrud.create(productData);
if (!result.success && result.errors) {
    // Laravel validation errors
    Object.keys(result.errors).forEach(field => {
        const errorMessage = result.errors[field][0]; // First error for field
        showError(`${field}: ${errorMessage}`);
    });
}
```

#### Model-Specific CRUD Operations
**Description:** Using CrudHelper with Laravel model validation
**Syntax:** `const modelCrud = new CrudHelper('modelTable');`
**Example:**
```javascript
// Products table now uses Product model validation
const productCrud = new CrudHelper('products');

// This will validate using Product::rules()
const newProduct = await productCrud.create({
    name: 'Construction Helmet',
    description: 'Safety equipment for workers',
    price: 29.99,
    category: 'Safety',
    stock_quantity: 50,
    is_active: true
});

// This will validate using Product::updateRules()
const updatedProduct = await productCrud.update(1, {
    price: 34.99,
    stock_quantity: 75
});
```

#### Validation Error Object Structure
**Description:** Structure of Laravel validation error responses
**Syntax:** `{ success: false, message: 'Validation failed', errors: {} }`
**Example:**
```javascript
// Example validation error response
const errorResponse = {
    success: false,
    message: 'Validation failed',
    errors: {
        name: ['The name field is required.'],
        price: ['The price must be at least 0.'],
        category: ['The category field is required.']
    }
};

// Handling multiple errors per field
Object.keys(errorResponse.errors).forEach(field => {
    errorResponse.errors[field].forEach(error => {
        console.log(`${field}: ${error}`);
    });
});
```

#### Enhanced Success Response Structure
**Description:** Enhanced success responses with model data
**Syntax:** `{ success: true, message: 'Record created successfully with validation', data: {} }`
**Example:**
```javascript
// Example enhanced success response
const successResponse = {
    success: true,
    message: 'Record created successfully with validation',
    id: 1,
    data: {
        id: 1,
        name: 'Safety Helmet',
        price: '29.99',
        category: 'Safety Equipment',
        stock_quantity: 100,
        is_active: true,
        created_at: '2025-11-11T13:31:13.000000Z',
        updated_at: '2025-11-11T13:31:13.000000Z'
    }
};
```

This reference covers all the JavaScript syntaxes and patterns used throughout the CPMS project, including animation-related syntaxes and Laravel model validation integration. Each syntax includes its purpose, proper usage, and real examples from the codebase.