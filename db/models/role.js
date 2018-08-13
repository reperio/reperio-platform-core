const Model = require('objection').Model;
const BaseModel = require('./baseModel');

class Role extends BaseModel {
    static get tableName() {
        return 'roles';
    }

    auto_generated_id() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'Object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                deleted: { type: 'boolean' },
                organizationId: { type: 'string' },
                applicationId: { type: 'string' },
            }
        };
    }

    static get relationMappings() {
        const RolePermission = require('./rolePermission');
        const UserRole = require('./userRole');
        const Organization = require('./organization');

        return {
            organizations: {
                relation: Model.HasOneRelation,
                modelClass: Organization,
                join: {
                    from: 'roles.organizationId',
                    to: 'organizations.id'
                }
            },
            rolePermissions: {
                relation: Model.HasManyRelation,
                modelClass: RolePermission,
                join: {
                    from: 'roles.id',
                    to: 'rolePermissions.roleId'
                }
            },
            userRoles: {
                relation: Model.HasManyRelation,
                modelClass: UserRole,
                join: {
                    from: 'roles.id',
                    to: 'userRoles.roleId'
                }
            }
        };
    }
}

module.exports = Role;
