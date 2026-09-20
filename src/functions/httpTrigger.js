const { app } = require('@azure/functions');

app.http('httpTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous', // anonymous allows easy testing without API keys
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const name = request.query.get('name') || await request.text() || 'World';

        return {
            status: 200,
            jsonBody: {
                message: `Hello, ${name}! Your GitHub-deployed Function is working!`,
                timestamp: new Date().toISOString()
            }
        };
    }
});