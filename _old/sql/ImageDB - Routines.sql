--	======================================
--	PURPOSE: This TVF recursively adds the
--	  parent category into a dot-syntax
--	  naming (e.g. Root.Child.GrandChild)
--	======================================
ALTER FUNCTION ImageDB.tvfECategory ()
RETURNS @ECategory TABLE (
	ECategoryID INT,
	Name VARCHAR(255),
	[Description] NVARCHAR(MAX),
	CategoryEndpoint VARCHAR(255),
	ParentECategoryID INT,
	Tags VARCHAR(255),
	UUID UNIQUEIDENTIFIER
)
AS
BEGIN
	WITH cte AS (
		SELECT
			c.ECategoryID,
			c.Name,
			c.[Description],
			CAST(c.Name AS VARCHAR(MAX)) AS CategoryEndpoint,
			c.ParentECategoryID,
			c.Tags,
			c.UUID
		FROM
			ImageDB.ECategory c
		WHERE
			c.ParentECategoryID IS NULL

		UNION ALL

		SELECT
			c.ECategoryID,
			c.Name,
			c.[Description],
			CAST(CONCAT(cte.CategoryEndpoint, '.', c.Name) AS VARCHAR(MAX)) AS CategoryEndpoint,
			c.ParentECategoryID,
			c.Tags,
			c.UUID
		FROM
			cte
			INNER JOIN ImageDB.ECategory c
				ON cte.ECategoryID = c.ParentECategoryID
	)

	INSERT INTO @ECategory
	SELECT
		*
	FROM
		cte;

	RETURN;
END

--	=======================================
--	PURPOSE: To call ImageDB.tvfECategory
--	  without having to use parameters
--	=======================================
--	CREATE VIEW ImageDB.vwECategory AS
--	SELECT
--		*
--	FROM
--		ImageDB.tvfECategory()