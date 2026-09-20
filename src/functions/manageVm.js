const { app } = require('@azure/functions');
const { DefaultAzureCredential } = require('@azure/identity');
const { ComputeManagementClient } = require('@azure/arm-compute');

// Notice the unique name: 'manageVm'
app.http('manageVm', {
    methods: ['GET', 'POST'],
    authLevel: 'function',
    handler: async (request, context) => {
        const subId = process.env.AZURE_SUBSCRIPTION_ID;
        const resourceGroup = request.query.get('resourceGroup');
        const vmName = request.query.get('vmName');
        const action = (request.query.get('action') || '').toLowerCase();

        if (!resourceGroup || !vmName || !['start', 'stop'].includes(action)) {
            return {
                status: 400,
                jsonBody: { error: "Provide valid query parameters: resourceGroup, vmName, action (start | stop)" }
            };
        }

        const credential = new DefaultAzureCredential();
        const client = new ComputeManagementClient(credential, subId);

        if (action === 'start') {
            await client.virtualMachines.beginStart(resourceGroup, vmName);
            return { jsonBody: { message: `Start signal sent to ${vmName}.` } };
        } else {
            await client.virtualMachines.beginDeallocate(resourceGroup, vmName);
            return { jsonBody: { message: `Deallocate/Stop signal sent to ${vmName}.` } };
        }
    }
});