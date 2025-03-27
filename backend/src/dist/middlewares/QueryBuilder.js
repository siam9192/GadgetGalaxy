"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
  constructor(modelQuery, query) {
    this.modelQuery = modelQuery;
    this.query = query;
    this.defaultPage = 1;
    this.defaultLimit = 10;
  }
  search(searchableFields) {
    var _a;
    const searchTerm =
      (_a = this === null || this === void 0 ? void 0 : this.query) === null ||
      _a === void 0
        ? void 0
        : _a.searchTerm;
    if (searchTerm && searchableFields.length) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      });
    }
    return this;
  }
  find() {
    const queryObj = Object.assign({}, this.query);
    // Filtering
    const excludeFields = ["searchTerm", "sort", "limit", "fields", "page"];
    for (let field of excludeFields) {
      delete queryObj[field];
    }
    this.modelQuery = this.modelQuery.find(Object.assign({}, queryObj));
    return this;
  }
  sort() {
    let sort = "-createdAt";
    if (this.query.sort) {
      sort = this.query.sort.split(",").join(" ");
    }
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }
  sortObjFormat() {
    let sort = {
      createdAt: -1,
    };
    if (this.query.sort) {
      sort = this.query.sort;
    }
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }
  populate(path) {
    if (path) {
      this.modelQuery = this.modelQuery.populate(path);
    }
    return this;
  }
  project(...fields) {
    this.modelQuery = this.modelQuery.select([...fields]);
    return this;
  }
  get() {
    return this.modelQuery;
  }
  paginate() {
    const page = Number(this.query.page) || this.defaultPage;
    const limit = Number(this.query.limit) || this.defaultLimit;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }
  count() {
    this.modelQuery.countDocuments();
    return this.modelQuery;
  }
  textSearch() {
    if (this.query.searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $text: { $search: this.query.searchTerm },
      });
    }
    return this;
  }
  getMeta() {
    return __awaiter(this, void 0, void 0, function* () {
      const total = yield this.modelQuery.countDocuments();
      const page = Number(this.query.page) || this.defaultPage;
      const limit = Number(this.query.limit) || this.defaultLimit;
      const pages = [...Array(Math.ceil(total / limit)).keys()].map(
        (page) => page + 1,
      );
      return {
        page,
        pages,
        limit,
        total,
      };
    });
  }
}
exports.default = QueryBuilder;
