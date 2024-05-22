import type {
    IDataObject,
    INodeProperties,
    // IExecuteFunctions,
    // INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IWebhookFunctions,
    IWebhookResponseData,
    NodeParameterValueType,
    // NodeExecutionWithMetadata,
} from 'n8n-workflow'
import { l3mbdaApiRequest } from './GenericFunctions'

const ethFilters: INodeProperties[] = [
    {
        displayName: 'From',
        displayOptions: {
            show: {
                event: ['eth-transfer'],
            },
        },
        name: 'from',
        placeholder: 'Filter by sender address (0x...)',
        default: '',
        type: 'string',
    },
    {
        displayName: 'To',
        displayOptions: {
            show: {
                event: ['eth-transfer'],
            },
        },
        name: 'to',
        placeholder: 'Filter by receiver address (0x...)',
        default: '',
        type: 'string',
    },
    {
        displayName: 'Min Amount',
        displayOptions: {
            show: {
                event: ['eth-transfer'],
            },
        },
        name: 'amount',
        placeholder: 'Minimum amount in token',
        default: '',
        type: 'number',
    },
]

const erc20Filters: INodeProperties[] = [
    {
        displayName: 'From',
        displayOptions: {
            show: {
                event: ['erc20-transfer'],
            },
        },
        name: 'from',
        placeholder: 'Filter by sender address (0x...)',
        default: '',
        type: 'string',
    },
    {
        displayName: 'To',
        displayOptions: {
            show: {
                event: ['erc20-transfer'],
            },
        },
        name: 'to',
        placeholder: 'Filter by receiver address (0x...)',
        default: '',
        type: 'string',
    },
    {
        displayName: 'Token Address',
        displayOptions: {
            show: {
                event: ['erc20-transfer'],
            },
        },
        name: 'token',
        placeholder: 'Filter by token contract address (0x...)',
        default: '',
        type: 'string',
    },
    {
        displayName: 'Min Amount',
        displayOptions: {
            show: {
                event: ['erc20-transfer'],
            },
        },
        name: 'amount',
        placeholder: 'Minimum amount in token',
        default: '',
        type: 'number',
    },
]

const erc721Filters: INodeProperties[] = [
    {
        displayName: 'From',
        displayOptions: {
            show: {
                event: ['erc721-transfer'],
            },
        },
        name: 'from',
        placeholder: 'Filter by sender address (0x...)',
        default: '',
        type: 'string',
    },
    {
        displayName: 'To',
        displayOptions: {
            show: {
                event: ['erc721-transfer'],
            },
        },
        name: 'to',
        placeholder: 'Filter by receiver address (0x...)',
        default: '',
        type: 'string',
    },
    {
        displayName: 'Token Address',
        displayOptions: {
            show: {
                event: ['erc721-transfer'],
            },
        },
        name: 'token',
        placeholder: 'Filter by token contract address (0x...)',
        default: '',
        type: 'string',
    },
    {
        displayName: 'Token ID',
        displayOptions: {
            show: {
                event: ['erc721-transfer'],
            },
        },
        name: 'tokenId',
        placeholder: 'Filter by token ID (0001)',
        default: '',
        type: 'number',
    },
]

const erc1155Filters: INodeProperties[] = [
    {
        displayName: 'From',
        displayOptions: {
            show: {
                event: ['erc1155-transfer'],
            },
        },
        name: 'from',
        placeholder: 'Filter by sender address (0x...)',
        default: '',
        type: 'string',
    },
    {
        displayName: 'To',
        displayOptions: {
            show: {
                event: ['erc1155-transfer'],
            },
        },
        name: 'to',
        placeholder: 'Filter by receiver address (0x...)',
        default: '',
        type: 'string',
    },
    {
        displayName: 'Token Address',
        displayOptions: {
            show: {
                event: ['erc1155-transfer'],
            },
        },
        name: 'token',
        placeholder: 'Filter by token contract address (0x...)',
        default: '',
        type: 'string',
    },
    {
        displayName: 'Token ID',
        displayOptions: {
            show: {
                event: ['erc1155-transfer'],
            },
        },
        name: 'tokenId',
        placeholder: 'Filter by token ID (0001)',
        default: '',
        type: 'number',
    },
]

export class L3mbda implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'L3MBDA',
        name: 'l3mbda',
        icon: 'file:l3mbda.svg',
        group: ['trigger'],
        version: 1,
        subtitle: '={{$parameter["event"]}}',
        description:
            'The ultimate web3 automation platform, ranging from basic alerts, to webhooks and even serverless functions.',
        defaults: {
            name: 'L3MBDA',
            color: '#000000',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'l3mbdaApi',
                required: true,
            },
        ],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'webhook',
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'event',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'ERC20 Transfer',
                        value: 'erc20-transfer',
                    },
                    {
                        name: 'ERC721 Transfer',
                        value: 'erc721-transfer',
                    },
                    {
                        name: 'ERC1155 Transfer',
                        value: 'erc1155-transfer',
                    },
                    {
                        name: 'ETH Transfer',
                        value: 'eth-transfer',
                    },
                ],
                default: 'erc20-transfer',
            },
            ...ethFilters,
            ...erc20Filters,
            ...erc721Filters,
            ...erc1155Filters,
        ],
    }
    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const req = this.getRequestObject()
        return {
            workflowData: [this.helpers.returnJsonArray(req.body)],
        }
    }
    // @ts-ignore
    webhookMethods = {
        default: {
            async checkExists(this: IWebhookFunctions): Promise<boolean> {
                const { oracleId } = this.getWorkflowStaticData('node')

                if (!oracleId) {
                    return false
                }

                try {
                    const { id } = await l3mbdaApiRequest.call(this, 'GET', { oracleId })
                    if (!id) {
                        return false
                    }
                } catch {
                    return false
                }

                return true
            },
            async create(this: IWebhookFunctions): Promise<boolean> {
                const webhookUrl = this.getNodeWebhookUrl('default')
                const webhookData = this.getWorkflowStaticData('node')
                const event = this.getNodeParameter('event') as string

                const filterData: Record<string, object | NodeParameterValueType | undefined> = {
                    from: this.getNodeParameter('from'),
                    to: this.getNodeParameter('to'),
                }

                if (['eth-transfer', 'erc20-transfer'].includes(event)) {
                    filterData.amount = this.getNodeParameter('amount')
                }

                if (['erc20-transfer', 'erc721-transfer', 'erc1155-transfer'].includes(event)) {
                    filterData.token = this.getNodeParameter('token')
                }

                if (['erc1155-transfer'].includes(event)) {
                    filterData.tokenId = this.getNodeParameter('tokenId')
                }

                const filters = Object.entries(filterData)
                    .filter(Boolean)
                    .map(([key, value]) => ({
                        type: key,
                        value: value,
                    }))

                const body: IDataObject = {
                    event: event,
                    destination: webhookUrl,
                    name: 'N8N',
                    action: 'webhook',
                    filters: filters,
                }
                const webhook = await l3mbdaApiRequest.call(this, 'POST', body)
                webhookData.oracleId = webhook.id
                return true
            },
            async delete(this: IWebhookFunctions): Promise<boolean> {
                const webhookData = this.getWorkflowStaticData('node')
                const body: IDataObject = {
                    oracleId: webhookData.oracleId,
                }
                try {
                    await l3mbdaApiRequest.call(this, 'DELETE', body)
                } catch {
                    return false
                }
                webhookData.oracleId = undefined
                return true
            },
        },
    }
}
