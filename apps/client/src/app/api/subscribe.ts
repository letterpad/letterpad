import { print } from 'graphql';
import gql from 'graphql-tag';
import { NextApiRequest, NextApiResponse } from 'next';

const query = gql`
  mutation AddSubscriber($email: String!) {
    addSubscriber(email: $email) {
      ok
      message
    }
  }
`;

const doSubscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  const resp = await fetch(process.env.GRAPHQL_URL as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      identifier: req.headers.host as string,
      Authorization: `Basic ${process.env.CLIENT_ID}`,
    },
    body: JSON.stringify({
      query: print(query),
      variables: req.body.variables,
    }),
  });
  const data = await resp.json();
  res.send(data);
};

export default doSubscribe;
