let endpoint = "https://yellow-mushroom-0877ef01e.3.azurestaticapps.net/data-api/graphql";
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    endpoint = "http://localhost:4280/data-api/graphql";
}

// Add an event listener to the subscribe button
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("subscribe-button").addEventListener("click", function () {

        const form = document.getElementById('subscribe-form');
        const emailInput = document.getElementById('email-input');
        const email = emailInput.value;
        console.log(`Email enter: "${email}"`)

        // Check if the email matches the regex pattern
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            console.log(`"Invalid Email: ${email}"`)
            alert('Please enter a valid email address.');
            return;
        }
        
        // Hide the "container" div and show the "transient" message
        document.getElementById('formDiv').style.display = 'none';
        document.getElementById('transientDiv').style.display = 'block';

        getByEmail(email, (isEmailFound) => {
            if (isEmailFound) {
                console.log(`Email already subscribed: "${email}"`)
                window.location.href = "duplicate.html"; 
            } else {
                subscribe(email, (success) => {
                    if (success) {
                        window.location.href = "success.html"; 
                    } else {
                        window.location.href = "error.html"; 
                    }
                });
            }
        });
    });
});

async function subscribe(id, completion) {
    console.log("Write to cosmosDB")
    const data = {
        id: id
    };
    
    const gql = `
        mutation create($item: CreatePersonInput!) {
        createPerson(item: $item) {
            id
        }
    }`;
      
    const query = {
        query: gql,
        variables: {
            item: data
        } 
    };
      
    const result = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query)
    });
    
    const response = await result.json();
    const createdPerson = response.data.createPerson
    if (createdPerson) {
        console.table(createdPerson);
        completion(true)
    } else {
        console.log("Service Error: Fail to subscribe email");
        completion(false)
    }
}

async function getByEmail(id, completion) {  
    const gql = `query getById($id: ID!) {
        person_by_pk(id: $id) {
           id 
        }
    }`;
      
    const query = {
      query: gql,
      variables: {
        id: id,
      },
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });
    
    const result = await response.json();
    const emailFetched = result.data.person_by_pk;
    if (emailFetched) {
        console.log(`Email Found: ${emailFetched.id}`);
        completion(true)
    } else {
        console.log("Email not found");
        completion(false)
    }
}

async function getAllEmail() {
    const query = `{
        people {
            items {
                id
            }
        }
    }`;

    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query })
    });
    const result = await response.json();
    console.table(result.data.people.items);
}

async function callAzureFunction() {
    try {
        // TEST: replace local host 
        const response = await fetch('http://localhost:7071/api/LandingPageAppFunction', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: email
        });

        console.log(response)

        if (response.ok) {
            alert("Subscription success.");
        } else {
            alert(`Subscription failed. Please try again later.`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error);
    }
}