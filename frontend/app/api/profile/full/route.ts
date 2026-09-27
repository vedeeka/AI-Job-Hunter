import { GET as getProfile } from '../route';

export async function GET(req: Request) {
  return getProfile(req);
}
