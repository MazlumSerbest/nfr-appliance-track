SELECT
  p.id,
  p.active,
  p.model,
  p."brandId",
  p."productTypeId",
  p."createdBy",
  p."createdAt",
  p."updatedBy",
  p."updatedAt",
  b.name AS "brandName",
  pt.type AS "productType"
FROM
  (
    (
      products p
      LEFT JOIN brands b ON ((p."brandId" = b.id))
    )
    LEFT JOIN "productTypes" pt ON ((p."productTypeId" = pt.id))
  );