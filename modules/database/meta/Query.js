class Query {
    constructor(db, ops = {}) {
        this._database = db;
        this._operations = ops;
        this._defaults = {
            schema: "dbo",
            table: null
        };
    }

    SetSchema(schema = "dbo") {
        this._defaults.schema = schema;

        return this;
    }
    SetTable(table) {
        this._defaults.table = table;

        return this;
    }

    QuoteName(schema, object) {
        return `[${ schema }].[${ object }]`;
    }
}

Query.Enums = {};

class Read extends Query {
    constructor(db, schema = "dbo") {
        super(db, {
            select: null,
            from: null,
            joins: []
        });

        this.SetSchema(schema);
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
                this._operations.from = this.QuoteName(this._defaults.schema, this._defaults.table);
            }
        }

        let ai = 0;
        let query = `
			SELECT
                ${ this._operations.select }
			FROM
				${ this._operations.from } t${ ai } WITH (NOLOCK)
        `;
        
        this._operations.joins.forEach(obj => {
            ai++;
            query += `
                ${ obj.type } ${ this.QuoteName(obj.schema, obj.table) } t${ ai } WITH (NOLOCK)
                    ON ${ obj.lcol } = ${ obj.rcol }
            `;
        });

        return query;
    }

    async Exec(callback = null) {
        return await this._database.Query(this.Construct(), callback);
    }

    Select(...cols) {
        this.Reset();

        if(cols.length === 0) {
            this._operations.select = "*";
        } else {
            this._operations.select = cols.join(",");
        }

        return this;
    }
    From(table, schema = null) {
        if(schema === null || schema === void 0) {
            schema = this._defaults.schema;
        }

        this._operations.from = this.QuoteName(schema, table);

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
        return this.Join(Read.Enums.JoinTypes.Inner, table, lcol, rcol, schema);
    }
    LeftJoin(table, lcol, rcol, schema = null) {
        return this.Join(Read.Enums.JoinTypes.Inner, table, lcol, rcol, schema);
    }
    RightJoin(table, lcol, rcol, schema = null) {
        return this.Join(Read.Enums.JoinTypes.Inner, table, lcol, rcol, schema);
    }
    OuterJoin(table, lcol, rcol, schema = null) {
        return this.Join(Read.Enums.JoinTypes.Inner, table, lcol, rcol, schema);
    }
}

Read.Enums = {
    ...Query.Enums,
    JoinTypes: {
        Inner: "INNER JOIN",
        Left: "LEFT JOIN",
        Right: "RIGHT JOIN",
        Outer: "OUTER JOIN"
    }
};

export default {
    Query,
    Read
};