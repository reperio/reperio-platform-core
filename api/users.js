const Joi = require('joi');

module.exports = [
    {
        method: 'GET',
        path: '/users/{userId}',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            const userId = request.params.userId;

            logger.debug(`Fetching user ${userId}`);

            const accounts = await uow.usersRepository.getUserById(userId);
            
            return {status: 0, message: 'success', data: accounts};
        },
        options: {
            validate: {
                params: {
                    userId: Joi.string().uuid().required()
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/users',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Fetching all users`);

            const users = await uow.usersRepository.getAllUsers();

            users.forEach(x => x.password = null);

            return users;
        },
        options: {
            auth: false,
            validate: {
            }
        }
    },
    {
        method: 'POST',
        path: '/users',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Creating user`);
            const payload = request.payload;

            const userDetail = {
                firstName: payload.firstName,
                lastName: payload.lastName,
                primaryEmail: payload.primaryEmail,
                primaryEmailVerified: false,
                disabled: false,
                deleted: false,
                password: null
            };

            const user = await uow.usersRepository.createUser(userDetail, payload.organizationIds);
            
            return user;
        },
        options: {
        auth: false,
            validate: {
                payload: {
                    firstName: Joi.string().required(),
                    lastName: Joi.string().required(),
                    primaryEmail: Joi.string().required(),
                    organizationIds: Joi.array()
                    .items(
                        Joi.string().guid()
                    ).min(1).required()
                }
            }
        }
    },
    {
        method: 'PUT',
        path: '/users/{userId}/roles',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Updating user roles`);
            const userId = request.params.userId;
            const roleIds = request.payload.roleIds;

            const userRoles = await uow.usersRepository.updateRoles(userId, roleIds);
            
            return userRoles;
        },
        options: {
        auth: false,
            validate: {
                params: {
                    userId: Joi.string().guid(),
                },
                payload: {
                    roleIds: Joi.array()
                        .items(
                            Joi.string()
                        ).min(1).required()
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/users/{userId}/roles',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Fetching user roles`);
            const userId = request.params.userId;

            const userRoles = await uow.usersRepository.getUserRoles(userId);
            
            return userRoles;
        },
        options: {
        auth: false,
            validate: {
                params: {
                    userId: Joi.string().guid(),
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/users/{id}',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;
            const id = request.params.id;

            logger.debug(`Deleting user with id: ${id}`);

            const result = await uow.usersRepository.deleteUser(id);
            
            return result;
        },
        options: {
            auth: false,
            validate: {
                params: {
                    id: Joi.string().uuid().required()
                }
            }
        }  
    }

];

