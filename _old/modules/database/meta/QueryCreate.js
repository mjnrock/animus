import Query from "./Query";

class QueryCreate extends Query {
    constructor(db, schema = "dbo") {
        super(db, {
            table: null,
            columns: [],
            values: []
        });

        this.SetDefaultSchema(schema);
    }

    Reset() {
        this._operations.table = null;
        this._operations.columns = [];
        this._operations.values = [];

        return this;
    }

    Construct() {
        let query = `INSERT INTO ${ this._operations.table }`;

        if(this._operations.columns.length > 0) {
            query += ` (${ this._operations.columns.join(", ") })`;
        }

        if(this._operations.values.length > 0) {
            query += `\nVALUES`;

            let values = [];
            this._operations.values.forEach(vals => {
                values.push(`(${ vals.join(",") })`);
            });
            query += `\n\t${ values.join(",\n\t") }`;
        }

        return `${ query };`;
    }

    async Exec(callback) {
        return await callback(this.Construct());
        return await Query.prototype.Exec.call(this, this.Construct(), callback);
    }

    Insert(table, schema = null) {
        if(schema === null || schema === void 0) {
            schema = this._defaults.schema;
        }

        this._operations.table = this.QuoteName(table, schema);

        return this;
    }

    Columns(...cols) {
        cols.forEach(col => {
            this._operations.columns.push(this.QuoteName(col));
        });

        return this;
    }

    Values(...vals) {
        this._operations.values = vals;

        return this;
    }
}

export default QueryCreate;