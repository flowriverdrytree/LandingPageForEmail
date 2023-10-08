const { app } = require('@azure/functions');

app.http('LandingPageAppFunction', {
    // methods: ['GET', 'POST'],
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        try {
            const email = request.query.get('email') || (await request.text()) || 'Default_Email';
            context.log(`Subscribed Email: ${email}`);

            // TODO: save email to Azure storage
            const dbConnection = "AccountEndpoint=https://cosdb-zhisliu.documents.azure.com:443/;AccountKey=q7XDw0SeclBAiQHotlXM2BQe17WTUnoysY3q4gyDWmTYCU0K67pOTI95GhDtAZ0lT51bLNSevcFVACDbrzULsQ==;";
            // await getByEmail(context, "efg@dummyTestAppNonExistZhi.com")

            return { status: 200 };
        } catch (error) {
            context.log(`Error: "${error}"`);
            return {
                status: 500,
                body: 'Internal Server Error',
            };
        }
    }
});

async function getByEmail(context, email) {
    const gql = `
      query getByEmail($email: String!) {
        person_by_email(email: $email) {
          Email
        }
      }`;
  
    const query = {
      query: gql,
      variables: {
        email: email,
      },
    };
  
    const endpoint = "http://localhost:4280/data-api/graphql";
    context.log(`>>> endpoint: ${endpoint}`);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });
    
    const result = await response.json();
    
    if (result.data && result.data.person_by_email) {
        context.log(result.data.person_by_email);
    } else {
        context.log(`No data found for email: ${email}`);
    }
}

  