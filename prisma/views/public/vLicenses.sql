SELECT
  l.id,
  CASE
    WHEN (
      (l."customerId" IS NULL)
      AND (((l."cusName") :: text = '' :: text) IS NOT FALSE)
      AND (l."orderedAt" IS NULL)
      AND (l."expiryDate" IS NULL)
    ) THEN 'stock' :: text
    WHEN (
      (
        (l."customerId" IS NOT NULL)
        OR (l."cusName" IS NOT NULL)
      )
      AND (l."orderedAt" IS NULL)
      AND (l."expiryDate" IS NULL)
    ) THEN 'order' :: text
    WHEN (
      (
        (l."customerId" IS NOT NULL)
        OR (l."cusName" IS NOT NULL)
      )
      AND (l."orderedAt" IS NOT NULL)
      AND (l."expiryDate" IS NULL)
    ) THEN 'waiting' :: text
    WHEN (l."expiryDate" IS NOT NULL) THEN 'active' :: text
    ELSE 'waiting' :: text
  END AS STATUS,
  l."serialNo",
  l."startDate",
  l."expiryDate",
  l."boughtAt",
  l."soldAt",
  l."orderedAt",
  l."createdBy",
  l."createdAt",
  l."updatedBy",
  l."updatedAt",
  l.deleted,
  l."appSerialNo",
  COALESCE(a."serialNo", l."appSerialNo") AS "applianceSerialNo",
  CASE
    WHEN (
      (a.product IS NULL)
      AND (p.model IS NOT NULL)
      AND (pb.name IS NOT NULL)
    ) THEN (
      ((pb.name) :: text || ' ' :: text) || (p.model) :: text
    )
    ELSE a.product
  END AS product,
  COALESCE(a."productModel", p.model) AS "productModel",
  COALESCE(a."productBrand", pb.name) AS "productBrand",
  (
    (
      (((b.name) :: text || ' ' :: text) || (lt.type) :: text) || ' ' :: text
    ) || lt.duration
  ) AS "licenseType",
  bt.type AS "boughtType",
  CASE
    WHEN (
      (c.name IS NOT NULL)
      AND (l."cusName" IS NOT NULL)
      AND ((l."cusName") :: text <> '' :: text)
    ) THEN (
      (
        (
          ((c.name) :: text || '(' :: text) || (l."cusName") :: text
        ) || ')' :: text
      )
    ) :: character varying
    WHEN (c.name IS NULL) THEN l."cusName"
    ELSE c.name
  END AS "customerName",
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
                LEFT JOIN brands b ON ((lt."brandId" = b.id))
              )
              LEFT JOIN currents c ON ((l."customerId" = c.id))
            )
            LEFT JOIN currents d ON ((l."dealerId" = d.id))
          )
          LEFT JOIN currents sd ON ((l."subDealerId" = sd.id))
        )
        LEFT JOIN currents s ON ((l."supplierId" = s.id))
      )
      LEFT JOIN products p ON ((l."productId" = p.id))
    )
    LEFT JOIN brands pb ON ((p."brandId" = pb.id))
  )
WHERE
  (l.deleted = false);