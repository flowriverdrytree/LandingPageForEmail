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
