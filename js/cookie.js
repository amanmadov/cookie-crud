/*

    MSIN 625 Project1 Cookie CRUD
    by: Nury Amanmadov

*/

//#region Helper Functions 

// parametric function to shift todays date forward by the number of days given
// ex: if todays date is 11/07/2022 getExpireDate(5) returns 2022-11-12
// ex: if todays date is 11/07/2022 getExpireDate(55) returns 2023-01-01
const getExpireDate = (offsetDay) => {
    const now = new Date();
    now.setDate(now.getDate() + offsetDay);

    let day = ('0' + (now.getDate())).slice(-2);
    let month = ('0' + (now.getMonth() + 1)).slice(-2);
    let year = now.getFullYear();

    return `${year}-${month}-${day}`;
}

// function to style output text
const colorizeOutput = (element,className) => {
    if(className === 'danger') element.classList.add('danger');
    if(className !== 'danger' && element.classList.contains('danger')) element.classList.remove('danger');
}

// creates html table for cookies and renders 
const createCookiesTable = (cookies) => {

    let rows = cookies.map((cookie,index) => {

        // get cookie name and value
        let cName = cookie.split('=')[0].trim();
        let cValue = cookie.split('=')[1].trim();

        // create table row
        return index % 2 === 0 ?
                    `<tr>
                        <th>${cName}</th>
                        <th>${cValue}</th>
                    </tr>`
                    :
                    `<tr class="active-row">
                        <th>${cName}</th>
                        <th>${cValue}</th>
                    </tr>`;
    });

    let tableStr = `<table class="styled-table">
                        <thead>
                            <tr>
                                <th>Cookie Name</th>
                                <th>Cookie Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.join('')}
                        </tbody>
                    </table>`;

    // rendering created table
    if(output.classList.contains('danger')) output.classList.remove('danger');      
    output.innerHTML = tableStr;
}

const updateOutputLabel = (element, className, textContent) => {
    colorizeOutput(element, className);
    output.textContent = textContent;
}

//#endregion

// elements
const buttons = document.querySelectorAll('button');
const inputs = document.querySelectorAll('input');
const output = document.querySelector('.output');



//#region CRUD Functions  

const setCookie = (cookieObj) => {

    // using ES6 object destructuring
    const { cookieName, cookieValue, cookieExpire } = cookieObj;

    if (cookieValue.trim().length > 0) {
        document.cookie = `${cookieName.trim()}=${encodeURIComponent(cookieValue.trim())};path=/;expires=${cookieExpire.toUTCString()}`;
        updateOutputLabel(output, '', `Cookie is set for CookieName '${cookieName}!'`);
        return;
    }
    
    updateOutputLabel(output, 'danger', `Cookie needs a value!!!`);
}

const getCookie = (cookieName) => {

    let cookies = document.cookie.split(';');

    cookies.some(cookie => {
        cookie.trim();
        let cookieValues = cookie.split('=');
        if (cookieValues[0].trim() === cookieName) {
            updateOutputLabel(output, '', `Cookie found. The value for the cookieName '${cookieValues[0]}' is '${decodeURIComponent(cookieValues[1])}'`);
            return;
        }
        updateOutputLabel(output, 'danger', `No cookies found. Please try again.`);
    })
}

const deleteCookie = (cookieName) => {

    let cookies = document.cookie.split(';');

    // check if cookie with the given name exists
    if(cookies.filter(cookie => cookie.split('=')[0].trim() === cookieName).length > 0){
        document.cookie = `${cookieName}=''; path=/; expires='Thu, 01 Jan 1970 00:00:01 GMT';`;
        updateOutputLabel(output, '', `Cookie with the name '${cookieName}' has been deleted!`);
        return;
    }

    // cookie does not exist
    updateOutputLabel(output, 'danger', `Cookie with the name '${cookieName}' has not been found!`);
}

const allCookies = () => {

    let cookies = document.cookie.split(';');

    // check if any cookie exist
    if(!cookies[0].includes('=')){
        updateOutputLabel(output, 'danger', `No cookies found. Please try again.`);
        return;
    }

    // cookies exist
    createCookiesTable(cookies);
}

const clickHandler = (e) => {

    // Gets the first word of button value
    let action = e.target.innerHTML.substr(0, e.target.innerHTML.indexOf(' ')).toLowerCase();
    let c = {};

    // creates cookie object
    inputs.forEach((input) => {
        let attributeName = input.getAttribute('name');
        let attributeValue = (attributeName !== 'cookieExpire' ? input.value : input.valueAsDate);
        c[attributeName] = attributeValue;
    })

    if (action === 'set') setCookie(c);
    if (action === 'get') getCookie(c.cookieName);
    if (action === 'delete') deleteCookie(c.cookieName);
    if (action === 'all') allCookies();
}

//#endregion

// Sets default value for date input
document.addEventListener('DOMContentLoaded', () => {
    let expireDate = getExpireDate(3);
    document.querySelector('input[type=date]').value = expireDate;
})

// attaches eventhandler for click event for all buttons
buttons.forEach(btn => {
    btn.addEventListener('click', clickHandler);
});

