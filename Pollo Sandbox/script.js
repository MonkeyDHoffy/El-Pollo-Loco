

let contacts = [
    new Contact('John', 'Doe', '1234567890'),
    new Friendship('Alice', 'Smith')
  ];

function addContact(firstName, lastName,number) {
    let myContact = new Contact(firstName, lastName, number);
    //myContact.firstName = fn; is basicly the same as:
    //myContact['firstName'] = fn;
    //myContact['firstName'] = fn;
    //myContact['lastName'] = ln;
    contacts.push(myContact);
}

addContact('Jane', 'Smith', '0987654321');
addContact('Alice', 'Johnson', '5551234567');
addContact('David', 'Wilson', '5559876543');
addContact('Eve', 'Taylor', '5552468135');
addContact('Frank', 'Anderson', '5551357924');
addContact('Grace', 'Martinez', '5558642097');
addContact('Hannah', 'Garcia', '5557531598');
