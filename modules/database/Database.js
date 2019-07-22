class Database {
	constructor(driver, config) {
		this._driver = driver;
		this._config = config;
		this._pool = null;

		if(this._driver.ConnectionPool) {
			this._pool = new this._driver.ConnectionPool(config)
				.connect()
				.then(pool => {
					console.log(`Connected to: [Server: ${ config.server }, Database: ${ config.database }]`);
			
					return pool;
				})
				.catch(err => console.log("Database Connection Failed! Bad Config: ", err));
		}

		this._context = {};
		this._defaults = {
			schema: config.schema || "dbo",
			table: ""
		};
	}

	SetDefault({ schema = null, table = null } = {}) {
		if(schema !== null && schema !== void 0) {
			this._defaults.schema = schema;
		}
		if(table !== null && table !== void 0) {
			this._defaults.table = table;
		}
	}

	async Query(query, callback = null) {
		const request = await (await this._pool).request(),
			result = await request.query(query);
			
		if(typeof callback === "function") {
			callback(await result);

			return true;
		}

		return await result;
	}

	async Pull(table, { schema = null, where = null, group = null, having = null, order = null } = {}) {
		if(schema === null || schema === void 0) {
			schema = this._defaults.schema;
		}

		let query = `
			SELECT
				*
			FROM
				[${ schema }].[${ table }] t WITH (NOLOCK)
		`;

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


		const request = await (await this._pool).request(),
			result = await request.query(query);

		if(result !== null && result !== void 0) {
			this._context[ schema ] = this._context[ schema ] || {};
			this._context[ schema ][ table ] = await result.recordset;
		}

		return await this;
	}

	static SQLifyInput(input, colData) {
		if(typeof colData !== "boolean") {
			if(colData.meta.isString === 1) {
				return [
					colData.name,
					`'${ input }'`
				];
			} else if(input === null) {
				return [
					colData.name,
					`NULL`
				];
			} else {
				return [
					colData.name,
					input
				];
			}
		}
	}
}

export default Database;