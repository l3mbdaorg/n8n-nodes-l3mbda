import type {
    IAuthenticateGeneric,
    // ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow'

export class Api implements ICredentialType {
    name = 'l3mbdaApi'
    displayName = 'L3MBDA API'
    documentationUrl = 'https://docs.url'
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
        },
    ]
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '={{Bearer $credentials.apiKey}}',
            },
        },
    }
    // test: ICredentialTestRequest = {
    // 	request: {
    // 		baseURL: 'https://l3mbda.com',
    // 		encoding: 'json',
    // 		url: '/api/user',
    // 		method: 'GET',
    // 		headers: {
    // 			// Send this as part of the query string
    // 			Bearer: '={{Bearer $credentials.apiKey}}',
    // 		}
    // 	},
    // };
}
