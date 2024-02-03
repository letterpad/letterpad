import { print } from 'graphql';
import gql from 'graphql-tag';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const query = gql`
  mutation AddSubscriber($email: String!) {
    addSubscriber(email: $email) {
      ok
      message
    }
  }
`;

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const req = await request.json();

    const resp = await fetch(process.env.GRAPHQL_URL as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        identifier: headersList.get('host')!,
        Authorization: `Basic ${process.env.CLIENT_ID}`,
      },
      body: JSON.stringify({
        query: print(query),
        variables: req.variables,
      }),
    });
    const data = await resp.json();
    return NextResponse.json(data);
  } catch (e) {
    //@ts-ignore
    return NextResponse.error(e);
  }
}
