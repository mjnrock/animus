class Database {
	constructor(driver, config) {
		this._driver = driver;
		this._config = config;
		this._pool = null;

        //* package: "mssql"
		if(this._driver.ConnectionPool) {
			this._pool = new this._driver.ConnectionPool(config)
				.connect()
				.then(pool => {
					console.log(`Connected to: [Server: ${ config.server }, Database: ${ config.database }]`);
			
					return pool;
				})
				.catch(err => console.log("Database Connection Failed! Bad Config: ", err));
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