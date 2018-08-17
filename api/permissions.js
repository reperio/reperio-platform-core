const Joi = require('joi');

module.exports = [
    {
        method: 'GET',
        path: '/permissions',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Fetching all permissions`);

            const permissions = await uow.permissionsRepository.getAllPermissions();
            
            return permissions;
        },
        options: {
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/permissions/{id}',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Fetching permission by id`);
            const id = request.params.id;

            const permission = await uow.permissionsRepository.getPermissionById(id);

            return permission;
        },
        options: {
            auth: false,
            validate: {
                params: {
                    id: Joi.string().guid().required()
                }
            }
        }  
    },
    {
        method: 'POST',
        path: '/permissions',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Creating permission`);
            const payload = request.payload;

            const permission = await uow.permissionsRepository.createPermission(payload.name, payload.description, payload.applicationId);

            return permission;
        },
        options: {
            auth: false,
            validate: {
                payload: {
                    name: Joi.string().required(),
                    description: Joi.string().required(),
                    applicationId: Joi.string().guid().optional()
                }
            }
        }  
    },
    {
        method: 'PUT',
        path: '/permissions/{permissionId}',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;

            logger.debug(`Editing permission`);
            const id = request.params.permissionId;
            const payload = request.payload;

            const permission = await uow.permissionsRepository.editPermission(id, payload.name, payload.description, payload.applicationId);

            return permission;
        },
        options: {
            auth: false,
            validate: {
                params: {
                    permissionId: Joi.string().guid()
                },
                payload: {
                    name: Joi.string().required(),
                    description: Joi.string().required(),
                    applicationId: Joi.string().guid().optional()
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/permissions/{permissionId}',
        handler: async (request, h) => {
            const uow = await request.app.getNewUoW();
            const logger = request.server.app.logger;
            const id = request.params.permissionId;

            logger.debug(`Deleting permission with id: ${id}`);

            const result = await uow.permissionsRepository.deletePermission(id);

            return result;
        },
        options: {
            auth: false,
            validate: {
                params: {
                    permissionId: Joi.string().uuid().required()
                }
            }
        }
    }
];