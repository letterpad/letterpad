'use client';
import { Button } from 'ui/dist/index.mjs';

import { startClientSso } from '@/lib/utils/clientSso';

export const Login = () => <Button onClick={() => startClientSso(true)}>Login</Button>;
