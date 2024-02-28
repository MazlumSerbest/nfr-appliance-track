SELECT
  p.id,
  p.date,
  p."createdBy",
  p."createdAt",
  p."updatedBy",
  p."updatedAt",
  c.name AS "customerName",
  d.name AS "dealerName",
  pr.model AS "productModel",
  b.name AS "productBrand",
  lt.type AS "licenseType",
  lt.duration AS "licenseDuration"
FROM
  (
    (
      (
        (
          (
            projects p
            LEFT JOIN currents c ON ((p."customerId" = c.id))
          )
          LEFT JOIN currents d ON ((p."dealerId" = d.id))
        )
        LEFT JOIN products pr ON ((p."productId" = pr.id))
      )
      LEFT JOIN brands b ON ((pr."brandId" = b.id))
    )
    LEFT JOIN "licenseTypes" lt ON ((p."licenseTypeId" = lt.id))
  );