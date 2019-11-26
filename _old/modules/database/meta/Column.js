class Column {
    constructor(name, type, ordinal) {
        this._name = name;
        this._type = type;
        this._ordinal = ordinal;

        this._meta = {
            Length: null,
            Precision: null,
            Scale: null,
            Properties: {
                PrimaryKey: false,
                ForeignKey: false,
                Nullable: true,
                Identity: false
            },
            Reference: {
                Schema: null,
                Table: null,
                Column: null
            }
        }
    }

    GetName() {
        return this._name;
    }
    SetName(name) {
        this._name = name;

        return this;
    }

    GetType() {
        return this._type;
    }
    SetType(type) {
        this._type = type;

        return this;
    }

    GetOrdinal() {
        return this._ordinal;
    }
    SetOrdinal(ordinal) {
        this._ordinal = ordinal;

        return this;
    }

    GetMeta() {
        return this._meta;
    }
    SetMeta({ length = null, precision = null, scale = null } = {}) {
        if(length !== null && length !== void 0) {
            this.SetLength(length);
        }
        if(precision !== null && precision !== void 0) {
            this.SetPrecision(precision);
        }
        if(scale !== null && scale !== void 0) {
            this.SetScale(scale);
        }

        return this;
    }
    
    GetProperties() {
        return this._meta.Properties;
    }
    SetProperties({ pk = null, fk = null, nullable = null, identity = null } = {}) {
        if(pk !== null && pk !== void 0) {
            this._meta.Properties.PrimaryKey = !!pk;
        }
        if(fk !== null && fk !== void 0) {
            this._meta.Properties.ForeignKey = !!fk;
        }
        if(nullable !== null && nullable !== void 0) {
            this._meta.Properties.Nullable = !!nullable;
        }
        if(identity !== null && identity !== void 0) {
            this._meta.Properties.Identity = !!identity;
        }

        return this;
    }

    GetLength() {
        return this._meta.Length;
    }
    SetLength(length) {
        this._meta.Length = length;

        return this;
    }
    GetPrecision() {
        return this._meta.Precision;
    }
    SetPrecision(precision) {
        this._meta.Precision = precision;

        return this;
    }
    GetScale() {
        return this._meta.Scale;
    }
    SetScale(scale) {
        this._meta.Scale = scale;

        return this;
    }

    GetReference() {
        if(this.IsForeignKey()) {
            return this._meta.Reference;
        }

        return false;
    }
    SetReference(schema, table, column) {
        this._meta.Properties.ForeignKey = true;
        this._meta.Reference.Schema = schema;
        this._meta.Reference.Table = table;
        this._meta.Reference.Column = column;

        return this;
    }
    
    IsPrimaryKey() {
        return this._meta.Properties.PrimaryKey;
    }
    IsForeignKey() {
        return this._meta.Properties.ForeignKey;
    }
    IsNullable() {
        return this._meta.Properties.Nullable;
    }
    IsIdentity() {
        return this._meta.Properties.Identity;
    }
}

export default Column;