SELECT
	c.DATA_TYPE AS 'type',
	c.COLUMN_NAME AS name,
	c.ORDINAL_POSITION AS ordinality,
	CONCAT(
		'{',
			'"precision": ', COALESCE(CAST(c.CHARACTER_MAXIMUM_LENGTH AS VARCHAR), CAST(c.NUMERIC_PRECISION AS VARCHAR), 'null'), ', ',
			'"scale": ', COALESCE(CAST(c.NUMERIC_SCALE AS VARCHAR), 'null'), ',' ,
			'"isUnicode": ', CASE WHEN c.CHARACTER_SET_NAME = 'UNICODE' THEN 1 ELSE 0 END,
		'}'
	) AS meta
FROM
	INFORMATION_SCHEMA.COLUMNS c
WHERE
	c.TABLE_SCHEMA = 'ImageDB'
	AND c.TABLE_NAME = 'ReferenceType'
ORDER BY
	ordinality