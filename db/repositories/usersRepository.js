const uuid4 = require("uuid/v4");

class UsersRepository {
    constructor(uow) {
        this.uow = uow;
    }

    async createUser(userDetail) {
        try {
            userDetail.id = uuid4();
            const q = this.uow._models.User
                .query(this.uow._transaction)
                .insertAndFetch(userDetail);

            const user = await q;

            return user;
        } catch (err) {
            this.uow._logger.error(err);
            this.uow._logger.error(`Failed to create user: ${userDetail.primaryEmail}`);
            throw err;
        }
    }

    async getUserById(userId) {
        try {
            const q = this.uow._models.User
                .query(this.uow._transaction)
                .where('id', userId);

            const user = await q;

            return user[0];
        } catch (err) {
            this.uow._logger.error(`Failed to fetch user using id: ${userId}`);
            this.uow._logger.error(err);
            throw err;
        }
    }

    async getUserByEmail(primaryEmail) {
        try {
            const q = this.uow._models.User
                .query(this.uow._transaction)
                .where('primaryEmail', primaryEmail);

            const user = await q;

            return user[0];
        } catch (err) {
            this.uow._logger.error(`Failed to fetch user using email: ${primaryEmail}`);
            this.uow._logger.error(err);
            throw err;
        }
    }

    async updateRoles(userId, roleIds) {
        try {
            await this.uow._models.UserRole
                .query(this.uow._transaction)
                .where({userId})
                .delete();

            const userRoles = roleIds.map((id) => {
                return {
                    roleId: id,
                    userId
                };
            });

            const q = this.uow._models.UserRole
                .query(this.uow._transaction)
                .insertAndFetch(userRoles);

            return await q;
        } catch (err) {
            this.uow._logger.error(err);
            this.uow._logger.error(`Failed to update user roles`);
            throw err;
        }
    }

    async getUserRoles(userId) {
        try {
            const userRoles = await this.uow._models.UserRole
                .query(this.uow._transaction)
                .where('userId', userId);

            const q = this.uow._models.Role
                .query(this.uow._transaction)
                .whereIn('id', userRoles.map((userRole) => {return userRole.roleId}));

            return await q;
        } catch (err) {
            this.uow._logger.error(err);
            this.uow._logger.error(`Failed to fetch user roles`);
            throw err;
        }
    }

    async deleteUser(id) {
        try {
            const q = this.uow._models.User
                .query(this.uow._transaction)
                .patch({deleted: true})
                .where('id', id);

            const result = await q;

            return result;
        } catch (err) {
            this.uow._logger.error(err);
            this.uow._logger.error(`Failed to delete user`);
            throw err;
        }
    }

    async disableUser(id) {
        try {
            const q = this.uow._models.User
                .query(this.uow._transaction)
                .patch({disabled: true})
                .where('id', id);

            const result = await q;

            return result;
        } catch (err) {
            this.uow._logger.error(err);
            this.uow._logger.error(`Failed to disable user`);
            throw err;
        }
    }
}

module.exports = UsersRepository;
