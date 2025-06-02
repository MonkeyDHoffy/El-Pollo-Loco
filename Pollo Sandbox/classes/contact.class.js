//Beschreibung: wie ein objekt aussieht
class Contact extends Person {
    
    phoneNumber;
    constructor(firstName, lastName, number) {
        super(firstName, lastName); 
        //super() calls the constructor of the parent class (Person)
        this.phoneNumber = number;
        console.log('Contact created!');
        }

        call(){
            window.location.href = `tel:${this.phoneNumber}`;
        }

        printFullName(){
            console.log(`${this.firstName} ${this.lastName}`);
        }
    }
    