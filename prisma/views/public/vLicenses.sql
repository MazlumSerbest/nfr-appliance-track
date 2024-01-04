SELECT
  l.id,
  l."isStock",
  l."serialNo",
  l."startDate",
  l."expiryDate",
  l."boughtAt",
  l."soldAt",
  l."createdBy",
  l."createdAt",
  l."updatedBy",
  l."updatedAt",
  l.deleted,
  a."serialNo" AS "applianceSerialNo",
  a."productModel",
  a."productBrand",
  lt.type AS "licenseType",
  lt.duration AS "licenseDuration",
  bt.type AS "boughtType",
  c.name AS "customerName",
  d.name AS "dealerName",
  sd.name AS "subDealerName",
  s.name AS "supplierName",
  CASE
    WHEN (l."expiryDate" IS NULL) THEN 'undefined' :: text
    WHEN (l."expiryDate" < CURRENT_DATE) THEN 'ended' :: text
    WHEN (
      l."expiryDate" <= (CURRENT_DATE + '30 days' :: INTERVAL)
    ) THEN 'ending' :: text
    ELSE 'continues' :: text
  END AS "expiryStatus"
FROM
  (
    (
      (
        (
          (
            (
              (
                licenses l
                LEFT JOIN "vAppliances" a ON ((l."applianceId" = a.id))
              )
              LEFT JOIN "licenseTypes" lt ON ((l."licenseTypeId" = lt.id))
            )
            LEFT JOIN "boughtTypes" bt ON ((l."boughtTypeId" = bt.id))
          )
          LEFT JOIN currents c ON ((l."customerId" = c.id))
        )
        LEFT JOIN currents d ON ((l."dealerId" = d.id))
      )
      LEFT JOIN currents sd ON ((l."subDealerId" = sd.id))
    )
    LEFT JOIN currents s ON ((l."supplierId" = s.id))
  );