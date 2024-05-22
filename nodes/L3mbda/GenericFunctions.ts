import type {
    IDataObject,
    IHookFunctions,
    IHttpRequestMethods,
    IRequestOptions,
    IWebhookFunctions,
} from 'n8n-workflow'

export async function l3mbdaApiRequest(
    this: IWebhookFunctions | IHookFunctions,
    method: IHttpRequestMethods,
    // tslint:disable-line:no-any
    body: any = {},
    query: IDataObject = {}
    // tslint:disable-line:no-any
): Promise<any> {
    const credentials = (await this.getCredentials('l3mbdaApi')) as IDataObject

    const apiKey = credentials.apiKey

    const endpoint =
        method === 'POST'
            ? 'https://l3mbda.com/api/oracles/simple/'
            : `https://l3mbda.com/api/oracles/${body.oracleId}`

    const options: IRequestOptions = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        method,
        body,
        qs: query,
        uri: endpoint,
        json: true,
    }

    if (!Object.keys(body).length) {
        options.body = undefined
    }
    if (!Object.keys(query).length) {
        options.qs = undefined
    }

    try {
        return await this.helpers.request!(options)
    } catch (error) {
        if (error.response) {
            const errorMessage =
                error.response.body.message || error.response.body.description || error.message
            throw new Error(`L3MBDA API error response [${error.statusCode}]: ${errorMessage}`)
        }
        throw error
    }
}
