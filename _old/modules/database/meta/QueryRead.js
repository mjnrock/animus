import Query from "./Query";

class QueryRead extends Query {
    constructor(db, schema = "dbo") {
        super(db, {
            select: null,
            from: null,
            joins: []
        });

        this.SetDefaultSchema(schema);
    }

    Reset() {
        this._operations.select = null;
        this._operations.from = null;
        this._operations.joins = [];

        return this;
    }

    Construct() {
        if(this._operations.from === null || this._operations.from === void 0) {
            if(this._defaults.table === null || this._defaults.table === void 0) {
                throw new Error("FROM clause and default table are both empty");
            } else {
                this._operations.from = this.QuoteName(this._defaults.table, this._defaults.schema);
            }
        }

        let ai = 0;
        let query = `SELECT \n\t${ this._operations.select } \nFROM \n\t${ this._operations.from } t${ ai } WITH (NOLOCK)`;
        
        this._operations.joins.forEach(obj => {
            ai++;
            query += `\n\t${ obj.type } ${ this.QuoteName(obj.table, obj.schema) } t${ ai } WITH (NOLOCK) \n\t\tON ${ obj.lcol } = ${ obj.rcol }`;
        });

        return `${ query };`;
    }

    async Exec(callback) {
        return await callback(this.Construct());
        return await Query.prototype.Exec.call(this, this.Construct(), callback);
    }

    Select(...cols) {
        this.Reset();

        if(cols.length === 0) {
            this._operations.select = "*";
        } else {
            this._operations.select = cols.join(",\n\t");
        }

        return this;
    }
    From(table, schema = null) {
        if(schema === null || schema === void 0) {
            schema = this._defaults.schema;
        }

        this._operations.from = this.QuoteName(table, schema);

        return this;
    }
    
    Join(type, table, lcol, rcol, schema = null) {
        if(schema === null || schema === void 0) {
            schema = this._defaults.schema;
        }

        if(this._operations.from === null || this._operations.from === void 0) {
            throw new Error("No FROM clause found");
        }

        this._operations.joins.push({
            type,
            table,
            schema,
            lcol,
            rcol
        });

        return this;
    }

    InnerJoin(table, lcol, rcol, schema = null) {
        return this.Join(QueryRead.Enums.JoinType.Inner, table, lcol, rcol, schema);
    }
    LeftJoin(table, lcol, rcol, schema = null) {
        return this.Join(QueryRead.Enums.JoinType.Inner, table, lcol, rcol, schema);
    }
    RightJoin(table, lcol, rcol, schema = null) {
        return this.Join(QueryRead.Enums.JoinType.Inner, table, lcol, rcol, schema);
    }
    OuterJoin(table, lcol, rcol, schema = null) {
        return this.Join(QueryRead.Enums.JoinType.Inner, table, lcol, rcol, schema);
    }
}

QueryRead.Enums = {
    ...Query.Enums,
    JoinType: {
        Inner: "INNER JOIN",
        Left: "LEFT JOIN",
        Right: "RIGHT JOIN",
        Outer: "OUTER JOIN"
    }
};

export default QueryRead;