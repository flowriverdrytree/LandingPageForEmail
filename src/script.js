// Add an event listener to the subscribe button
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("subscribe-button").addEventListener("click", function () {
        const email = "efg@dummyTestAppNonExistZhi.com"
        // getByEmail(email)
        listEmail();
        // callAzureFunction();
    });
});

async function getByEmail(email) {
    const gql2 = `query GetPersonByEmail($email: String!) {
        people(where: { Email: $email }) {
            items {
                Email
            }
        }
    }`;

    const gql = `
        query getByEmail($email: String!) {
            person_by_email(email: $email) {
                Email
            }
        }`;
  
    const query = {
      query: gql2,
      variables: {
        email: email,
      },
    };
  
    const endpoint = "http://localhost:4280/data-api/graphql";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });
    
    const result = await response.json();
    
    if (result.data && result.data.person_by_email) {
        console.log(result.data.person_by_email);
    } else {
        console.log(`No data found for email: ${email}`);
    }
}

async function listEmail() {
    const query = `
    {
        people {
            items {
                Email
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