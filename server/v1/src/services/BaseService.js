class BaseService {
    constructor(Model) {
        this.Model = Model;
    }

    findOne(where) {
        return this.Model.findOne(where);
    }

    insert(data) {
        return new this.Model(data).save();
    }

    list() {
        return this.Model.find({});
    }

    modify(data, id) {
        return this.Model.findByIdAndUpdate(id, data, { new: true });
    }

    remove(id) {
        return this.Model.findByIdAndDelete(id, { new: true });
    }
}

module.exports = BaseService;