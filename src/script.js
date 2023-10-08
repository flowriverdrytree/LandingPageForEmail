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

        // getByEmail2(email)

        getByEmail(email, (isEmailFound) => {
            if (isEmailFound) {
                console.log(`Email already subscribed: "${email}"`)
                window.location.href = "duplicate.html"; 
            } else {
                console.log("Write to cosmosDB")
                window.location.href = "success.html"; 
            }
        });
        
        // const email = "efg@YOOYOY.com";
        // getAllEmail()
        // callAzureFunction();
    });
});

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
  
    const endpoint = "http://localhost:4280/data-api/graphql";
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

    // TEST: replace localhost4280 (serving)with https://yellow-mushroom-0877ef01e.3.azurestaticapps.net for production testing
    const endpoint = "http://localhost:4280/data-api/graphql";
    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query })
    });
    const result = await response.json();
    console.table(result.data.people.items);
}

async function callAzureFunction() {
    const form = document.getElementById('subscribe-form');
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value;

    // Check if the email matches the regex pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    console.log(`Email enter: "${email}"`)

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