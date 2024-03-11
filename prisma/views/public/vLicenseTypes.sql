SELECT
  lt.id,
  lt.active,
  lt.duration,
  lt.type,
  lt.price,
  lt."brandId",
  lt."createdBy",
  lt."createdAt",
  lt."updatedBy",
  lt."updatedAt",
  b.name AS "brandName"
FROM
  (
    "licenseTypes" lt
    LEFT JOIN brands b ON ((lt."brandId" = b.id))
  );