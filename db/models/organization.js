const Model = require('objection').Model;
const BaseModel = require('./baseModel');

class Organization extends BaseModel {
    static get tableName() {
        return 'organizations';
    }

    auto_generated_id() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'Object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' }
            }
        };
    }

    static get relationMappings() {
        //const User = require('./user');
        const OrganizationApplication = require('./organizationApplication');

        return {
            // users: {
            //     relation: Model.HasManyRelation,
            //     modelClass: User,
            //     join: {
            //         from: 'organizations.id',
            //         to: 'users.organizationId'
            //     }
            // },
            organizationApplications: {
                relation: Model.HasManyRelation,
                modelClass: OrganizationApplication,
                join: {
                    from: 'organizations.id',
                    to: 'organizationApplications.organizationId'
                }
            }
        };
    }
}

module.exports = Organization;
