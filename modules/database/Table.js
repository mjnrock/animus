import Database from "./Database";

class Table {
	constructor(db, schema, table) {
		this._database = db;
		this._columns = [];
		this._data = {};

		this._meta = {
			schema,
			table,
			crud: {
				insert: () => `INSERT INTO [${ this._meta.schema }].[${ this._meta.table }] VALUES {0}`,
				select: () => `SELECT {0} FROM [${ this._meta.schema }].[${ this._meta.table }]`,
				update: () => `UPDATE [${ this._meta.schema }].[${ this._meta.table }] SET {0}`,
				delete: () => `DELETE FROM [${ this._meta.schema }].[${ this._meta.table }] WHERE {0}`
			}
		};

		this.MetaData();
		this.Select({
			callback: (results) => this.UpdateContext(results)
		});

		//? This is currently sending data to Database._context; consider moving
		// this._database.Pull(table, { schema, callback: () })
	}

	GetColumnData(col) {
		if(typeof col === "number") {
			return this._columns[ col ] || false;
		} else if(typeof col === "string" || col instanceof String) {
			return this._columns.filter((v, i) => v.name === col)[0] || false;
		}

		return false;
	}

	async MetaData() {
		this._database.Query(
			`SELECT
				c.COLUMN_NAME AS name,
				c.DATA_TYPE AS 'type',
				c.ORDINAL_POSITION AS ordinality,
				CONCAT(
					'{',
						'"precision": ', COALESCE(CAST(c.CHARACTER_MAXIMUM_LENGTH AS VARCHAR), CAST(c.NUMERIC_PRECISION AS VARCHAR), 'null'), ', ',
						'"scale": ', COALESCE(CAST(c.NUMERIC_SCALE AS VARCHAR), 'null'), ',',
						'"isString": ', CASE WHEN c.CHARACTER_SET_NAME IS NOT NULL THEN 1 ELSE 0 END, ',',
						'"isUnicode": ', CASE WHEN c.CHARACTER_SET_NAME = 'UNICODE' THEN 1 ELSE 0 END,
					'}'
				) AS meta
			FROM
				INFORMATION_SCHEMA.COLUMNS c
			WHERE
				c.TABLE_SCHEMA = 'ImageDB'
				AND c.TABLE_NAME = 'Camera'
			ORDER BY
				ordinality
			`,
			(data) => {
				let result = data.recordset || [];

				result = result.map(c => {
					c.meta = JSON.parse(c.meta);

					return c;
				});
				this._columns = result;
			}
		);

		return this;
	}

	async Select({ select = "*", from = null, where = null, group = null, having = null, order = null, callback = null } = {}) {
		let query = this._meta.crud.select().replace("{0}", select);

		if(from !== null && from !== void 0) {
			query += `
				${ from }
			`;
		}
		if(where !== null && where !== void 0) {
			query += `
				WHERE
					${ where }
			`;
		}
		if(group !== null && group !== void 0) {
			query += `
				GROUP BY
					${ group }
			`;
		}
		if(having !== null && having !== void 0) {
			query += `
				HAVING
					${ having }
			`;
		}
		if(order !== null && order !== void 0) {
			query += `
				ORDER BY
					${ order }
			`;
		}

		if(callback !== null && callback !== void 0) {
			let db = this._database;

			callback(await (await db.Query(query)).recordset);

			return true;
		}

		return await this._database.Query(query);
	}

	async Update(set = [], { where = null, callback = null }) {
		let query = this._meta.crud.update(),
			input = [];

		if(Array.isArray(set)) {
			set.forEach((v, i) => {
				let [ name, value ] = Database.SQLifyInput(v[1], this.GetColumnData(v[0]));

				input.push(`${ name }=${ value }`);
			});
		} else if(typeof set === "object") {
			for(let [ k, v ] of Object.entries(set)) {
				let [ name, value ] = Database.SQLifyInput(v, this.GetColumnData(k));

				input.push(`${ name }=${ value }`);
			}
		}
		set = input.join(",");

		if(where !== null && where !== void 0) {
			query += `
				WHERE
					${ where }
			`;
		}

		query = query.replace("{0}", set);
		query += `
			OUTPUT
				Inserted.*
		`;
		// console.log(query);

		if(callback !== null && callback !== void 0) {
			let db = this._database,
				result = await (await db.Query(query)).recordset;

			callback(await result);
			this.UpdateContext(await result);

			return true;
		}

		return await this._database.Query(query);
	}

	UpdateContext(results = []) {
		if(Array.isArray(results)) {
			results.forEach((record, i) => {
				let PK = Object.values(record)[0];

				this._data[ PK ] = record;
			});
		}

		return this._data;
	}
}

export default Table;