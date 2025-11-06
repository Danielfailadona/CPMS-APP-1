# JavaScript Syntax Component Breakdown - CPMS

## Basic Syntax Components

### Keywords
- **`const`** - Declares a constant variable that cannot be reassigned
- **`let`** - Declares a variable that can be reassigned
- **`var`** - Declares a variable (older syntax, avoid using)
- **`function`** - Declares a function
- **`async`** - Makes a function asynchronous (returns a Promise)
- **`await`** - Waits for a Promise to resolve
- **`try`** - Starts error handling block
- **`catch`** - Handles errors from try block
- **`if`** - Conditional statement
- **`else`** - Alternative condition
- **`for`** - Loop statement
- **`return`** - Returns value from function
- **`new`** - Creates new object instance
- **`this`** - Refers to current object context

### Operators
- **`=`** - Assignment operator (assigns value)
- **`==`** - Equality comparison (loose)
- **`===`** - Strict equality comparison
- **`!=`** - Not equal (loose)
- **`!==`** - Strict not equal
- **`>`** - Greater than
- **`<`** - Less than
- **`>=`** - Greater than or equal
- **`<=`** - Less than or equal
- **`&&`** - Logical AND
- **`||`** - Logical OR
- **`!`** - Logical NOT
- **`+`** - Addition or string concatenation
- **`-`** - Subtraction
- **`*`** - Multiplication
- **`/`** - Division
- **`%`** - Modulus (remainder)
- **`++`** - Increment by 1
- **`--`** - Decrement by 1
- **`+=`** - Add and assign
- **`-=`** - Subtract and assign
- **`?`** - Ternary operator (condition ? true : false)
- **`:`** - Ternary operator separator

### Punctuation
- **`{}`** - Curly braces (define code blocks, objects)
- **`[]`** - Square brackets (arrays, property access)
- **`()`** - Parentheses (function calls, grouping)
- **`;`** - Semicolon (statement terminator)
- **`,`** - Comma (separator)
- **`.`** - Dot notation (property access)
- **`'`** - Single quote (string delimiter)
- **`"`** - Double quote (string delimiter)
- **`` ` ``** - Backtick (template literal)
- **`${}`** - Template literal expression
- **`//`** - Single line comment
- **`/* */`** - Multi-line comment

---

## Detailed Syntax Breakdown Examples

### Variable Declaration
```javascript
const userName = 'John';
```
- **`const`** - Keyword declaring constant
- **`userName`** - Variable name (identifier)
- **`=`** - Assignment operator
- **`'John'`** - String value
- **`;`** - Statement terminator

### Function Declaration
```javascript
window.editUser = async function(id) {
    // code
};
```
- **`window`** - Global object
- **`.`** - Property access operator
- **`editUser`** - Property name
- **`=`** - Assignment operator
- **`async`** - Async keyword
- **`function`** - Function keyword
- **`(`** - Parameter list start
- **`id`** - Parameter name
- **`)`** - Parameter list end
- **`{`** - Function body start
- **`}`** - Function body end
- **`;`** - Statement terminator

### Object Creation
```javascript
const data = {
    name: 'John',
    age: 30
};
```
- **`const`** - Constant declaration
- **`data`** - Variable name
- **`=`** - Assignment
- **`{`** - Object literal start
- **`name`** - Property key
- **`:`** - Key-value separator
- **`'John'`** - Property value
- **`,`** - Property separator
- **`}`** - Object literal end

### Array Operations
```javascript
const users = ['John', 'Jane'];
```
- **`const`** - Constant declaration
- **`users`** - Variable name
- **`=`** - Assignment
- **`[`** - Array literal start
- **`'John'`** - Array element
- **`,`** - Element separator
- **`]`** - Array literal end

### Method Calls
```javascript
document.getElementById('myId');
```
- **`document`** - Object name
- **`.`** - Property access
- **`getElementById`** - Method name
- **`(`** - Parameter list start
- **`'myId'`** - String parameter
- **`)`** - Parameter list end

### Template Literals
```javascript
const html = `<div>${user.name}</div>`;
```
- **`const`** - Constant declaration
- **`html`** - Variable name
- **`=`** - Assignment
- **`` ` ``** - Template literal start
- **`<div>`** - HTML content
- **`${`** - Expression start
- **`user.name`** - Expression content
- **`}`** - Expression end
- **`` ` ``** - Template literal end

### Conditional Statements
```javascript
if (user.id === 1) {
    console.log('Admin');
} else {
    console.log('User');
}
```
- **`if`** - Conditional keyword
- **`(`** - Condition start
- **`user.id`** - Property access
- **`===`** - Strict equality
- **`1`** - Number value
- **`)`** - Condition end
- **`{`** - Block start
- **`console.log`** - Method call
- **`}`** - Block end
- **`else`** - Alternative keyword

### Arrow Functions
```javascript
const users = data.map(user => user.name);
```
- **`const`** - Constant declaration
- **`users`** - Variable name
- **`=`** - Assignment
- **`data`** - Array variable
- **`.map`** - Array method
- **`(`** - Parameter start
- **`user`** - Parameter name
- **`=>`** - Arrow function operator
- **`user.name`** - Return expression
- **`)`** - Parameter end

### Event Listeners
```javascript
form.addEventListener('submit', function(e) {
    e.preventDefault();
});
```
- **`form`** - Element variable
- **`.addEventListener`** - Method call
- **`(`** - Parameter start
- **`'submit'`** - Event type string
- **`,`** - Parameter separator
- **`function`** - Function keyword
- **`(e)`** - Event parameter
- **`{`** - Function body start
- **`e.preventDefault()`** - Method call
- **`}`** - Function body end
- **`)`** - Parameter end

### Async/Await
```javascript
const result = await fetch('/api/users');
```
- **`const`** - Constant declaration
- **`result`** - Variable name
- **`=`** - Assignment
- **`await`** - Await keyword
- **`fetch`** - Function call
- **`(`** - Parameter start
- **`'/api/users'`** - URL string
- **`)`** - Parameter end

### Try/Catch
```javascript
try {
    const data = await response.json();
} catch (error) {
    console.error(error);
}
```
- **`try`** - Try keyword
- **`{`** - Try block start
- **`const`** - Variable declaration
- **`await`** - Await keyword
- **`}`** - Try block end
- **`catch`** - Catch keyword
- **`(error)`** - Error parameter
- **`{`** - Catch block start
- **`console.error`** - Error logging
- **`}`** - Catch block end

### Class Constructor
```javascript
const crud = new CrudHelper('users');
```
- **`const`** - Constant declaration
- **`crud`** - Variable name
- **`=`** - Assignment
- **`new`** - Constructor keyword
- **`CrudHelper`** - Class name
- **`(`** - Parameter start
- **`'users'`** - String parameter
- **`)`** - Parameter end

### Property Access
```javascript
const name = user.name;
const email = user['email'];
```
- **`user.name`** - Dot notation access
- **`user['email']`** - Bracket notation access

### Comparison Operators
```javascript
if (password.length < 9) {
    return false;
}
```
- **`password.length`** - Property access
- **`<`** - Less than operator
- **`9`** - Number literal
- **`return`** - Return keyword
- **`false`** - Boolean literal

### Logical Operators
```javascript
if (user && user.id) {
    // code
}
```
- **`user`** - Variable check
- **`&&`** - Logical AND
- **`user.id`** - Property check

### Ternary Operator
```javascript
const status = user.is_active ? 'Active' : 'Inactive';
```
- **`user.is_active`** - Condition
- **`?`** - Ternary operator
- **`'Active'`** - True value
- **`:`** - Separator
- **`'Inactive'`** - False value

### String Methods
```javascript
const upperName = name.toUpperCase();
const hasAdmin = email.includes('@admin');
```
- **`.toUpperCase()`** - String method
- **`.includes()`** - String search method

### Array Methods Chain
```javascript
const html = users
    .filter(user => user.active)
    .map(user => `<div>${user.name}</div>`)
    .join('');
```
- **`.filter()`** - Array filtering
- **`.map()`** - Array transformation
- **`.join()`** - Array to string conversion

---

## Special Syntax Patterns

### FormData Constructor
```javascript
const formData = new FormData(form);
```
- **`new FormData()`** - Creates form data object from form element

### Destructuring Assignment
```javascript
const {name, email} = user;
```
- **`{name, email}`** - Destructuring pattern
- **`= user`** - Source object

### Spread Operator
```javascript
const newArray = [...oldArray, newItem];
```
- **`...`** - Spread operator
- **`[...oldArray]`** - Array spreading

### Template Literal with HTML
```javascript
const html = `
    <div class="user" data-id="${user.id}">
        <h3>${user.name}</h3>
        <p>${user.email}</p>
    </div>
`;
```
- **`` ` ``** - Template literal delimiters
- **`${}`** - Expression interpolation
- **Multi-line strings** - Preserves line breaks

### Event Handler Assignment
```javascript
button.onclick = function() {
    alert('Clicked!');
};
```
- **`.onclick`** - Event property
- **`= function()`** - Function assignment

### Window Global Assignment
```javascript
window.globalFunction = function() {
    // Makes function globally accessible
};
```
- **`window.`** - Global object property
- **Global scope** - Accessible from anywhere

This breakdown covers every syntax component used in your CPMS JavaScript files, explaining what each symbol, keyword, and operator does in the code.