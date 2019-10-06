import { HttpTransportType, HubConnectionBuilder } from '@aspnet/signalr';

export async function getAuthToken(server, nick)
{
    const response = await fetch(`${server}/api/auth/token?nick=${nick}`);
    return await response.text();
}

export async function connectToServer(server, token)
{
    return new HubConnectionBuilder()
            .withUrl(`${server}/signalr/chat`, {
                accessTokenFactory: () => token,
                transport: HttpTransportType.LongPolling
            })
            .build();
}