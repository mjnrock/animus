import Column from "./Column.js";

class Table {
    constructor(schema, name, columns = []) {
        this._schema = schema;
        this._name = name;
        this._columns = columns;
    }

    GetSchema() {
        return this._schema;
    }
    SetSchema(schema) {
        this._schema = schema;

        return this;
    }

    GetName() {
        return this._name;
    }
    SetName(name) {
        this._name = name;

        return this;
    }

    GetColumns() {
        return this._columns;
    }
    SetColumns(columns = []) {
        columns.forEach(col => this.AddColumn(col));

        return this;
    }
    AddColumn(column) {
        if(column instanceof Column) {
            this._columns.push(column);
        }

        return this;
    }
}

export default Table;