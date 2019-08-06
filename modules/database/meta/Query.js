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


export default Query;