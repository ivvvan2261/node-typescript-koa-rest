import { BaseContext } from 'koa';
import { request, summary, path, body, responsesAll, tagsAll } from 'koa-swagger-decorator';
import { default as UserService } from '../services/user.srvc';

@responsesAll({ 200: { description: 'success'}, 400: { description: 'bad request'}, 401: { description: 'unauthorized, missing/wrong jwt token'}})
@tagsAll(['User'])
export default class UserController {

    @request('get', '/users')
    @summary('Find all users')
    public static async getUsers(ctx: BaseContext) {
        // load all users
        const users = await UserService.findAll();

        // return OK status code and loaded users array
        ctx.status = 200;
        ctx.body = users;
    }
}
