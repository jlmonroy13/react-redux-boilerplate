import { apiCall } from 'libs/apiCall';
import { GET } from 'libs/httpMethods';
import { USERS } from 'libs/apiUrls';

export const reqGetUsers = () => apiCall(GET, USERS, {});
