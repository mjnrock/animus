class API {
	constructor(sql, pool, config) {
		this.MSSQL = sql;
		this.Pool = pool;
		this.Config = config;
	}

	async Handle(req, res) {
		let path = req.path.split("/").slice(2);

		const pool = await this.Pool;
		const request = await pool.request();

		if(path[0] === "s") {
			return await this.Select(request, path)
		} else if(path[0] === "u") {
			return await this.Update(request, path)
		}

		return {
			msg: "Invalid Call"
		};
	}

	async Select(request, path) {
		try {
			let query = `
					SELECT
						*
					FROM
						FuzzyKnights.ImageDB.${ path[1] } t WITH(NOLOCK)
				`;

			if(/\d+/.test(path[2])) {
				request = request.input("id", this.MSSQL.Int, path[2]);

				query += `
					WHERE
						t.${ path[1] }ID=@id
				`;
			}

			return await (await request.query(query)).recordset;
		} catch (e) {
			console.log(e);
		}
	}

	//	This stupid json stuff in the URL doesn't work reliably
	async Update(request, path) {
		try {

			console.log(decodeURI(path[2]));
			let query = `
					UPDATE FuzzyKnights.ImageDB.${ path[1] }
					SET
				`,
				json = JSON.parse(decodeURI(path[2]));

			Object.entries(json).forEach((k, v, i) => {
				query += `${ k }=${ v }`;
			});

			// return await (await request.query(query)).recordset;
			return {
				sql: query
			}
		} catch (e) {
			console.log(e);
		}
	}

	// async ReferenceType(request, path) {
	// 	let query = `
	// 		SELECT
	// 			*
	// 		FROM
	// 			FuzzyKnights.ImageDB.ReferenceType rt WITH(NOLOCK)
	// 	`;

	// 	if(/\d+/.test(path[1])) {
	// 		const result = await pool.request()
	// 			.input("id", this.MSSQL.Int, path[1])
	// 			.query(`
	// 				${ query }
	// 				WHERE
	// 					rt.ReferenceTypeID=@id
	// 			`);
	
	// 			return await result.recordset;
	// 	} else {
	// 		const result = await pool.request()
	// 			.query(query);

	// 		return await result.recordset;
	// 	}
	// }
}

export default API;