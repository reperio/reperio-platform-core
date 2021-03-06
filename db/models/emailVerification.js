const Model = require('objection').Model;
const BaseModel = require('./baseModel');

class EmailVerification extends BaseModel {
    static get tableName() {
        return 'emailVerifications';
    }

    autoGeneratedId() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'Object',
            properties: {
                id: { type: 'string' },
                userId: { type: 'string' },
                createdAt: { type: 'dateTime' },
                triggeredAt: { type: 'dateTime' }
            }
        };
    }

    static get relationMappings() {
        const User = require('./user');

        return {
            user: {
                relation: Model.HasOneRelation,
                modelClass: User,
                join: {
                    from: 'emailVerifications.userId',
                    to: 'users.id'
                }
            }
        };
    }
}

module.exports = EmailVerification;