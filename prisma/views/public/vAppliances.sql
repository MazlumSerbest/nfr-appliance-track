SELECT
  a.id,
  a."serialNo",
  a."boughtAt",
  a."soldAt",
  a."createdBy",
  a."createdAt",
  a."updatedBy",
  a."updatedAt",
  a.deleted,
  l."startDate" AS "licenseStartDate",
  l."expiryDate" AS "licenseExpiryDate",
  l."licenseType",
  l."licenseDuration",
  p.model AS "productModel",
  p.brand AS "productBrand",
  c.name AS "customerName",
  d.name AS "dealerName",
  s.name AS "supplierName"
FROM
  (
    (
      (
        (
          (
            appliances a
            LEFT JOIN "vLicenses" l ON ((a."licenseId" = l.id))
          )
          LEFT JOIN products p ON ((a."productId" = p.id))
        )
        LEFT JOIN customers c ON ((a."customerId" = c.id))
      )
      LEFT JOIN dealers d ON ((a."dealerId" = d.id))
    )
    LEFT JOIN suppliers s ON ((a."supplierId" = s.id))
  );