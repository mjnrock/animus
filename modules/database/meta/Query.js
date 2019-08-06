class Query {
    constructor(db, ops = {}) {
        this._database = db;
        this._operations = ops;
        this._defaults = {
            schema: "dbo",
            table: null
        };
    }

    SetDefaultSchema(schema = "dbo") {
        this._defaults.schema = schema;

        return this;
    }
    SetDefaultTable(table) {
        this._defaults.table = table;

        return this;
    }

    async Exec(query, callback = null) {
        return await this._database.Query(query, callback);
    }

    QuoteName(object, schema = null, database = null, server = null) {
        //*  MSSQL
        let syntax = `[${ object }]`;

        if(schema !== null && schema !== void 0) {
            syntax = `[${ schema }].${ syntax }`;
            
            if(database !== null && database !== void 0) {
                syntax = `[${ database }].${ syntax }`;
                
                if(server !== null && server !== void 0) {
                    syntax = `[${ server }].${ syntax }`;
                }
            }
        }

        return syntax;
    }
}

Query.Enums = {
    // SetOptions: {
    //     IdentityInsertOn: "SET IDENTITY_INSERT ON;",
    //     IdentityInsertOff: "SET IDENTITY_INSERT OFF;",

    //     NoCountOn: "SET NOCOUNT ON;",
    //     NoCountOff: "SET NOCOUNT OFF;",
    // },
    DatabaseType: {
        MSSQL: "MSSQL",
        Oracle: "ORACLE",
        MySQL: "MYSQL"
    }
};

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

export default {
    Query,
    QueryRead,
    QueryCreate
};