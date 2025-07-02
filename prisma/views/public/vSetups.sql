SELECT
SET
.id,
SET
.type,
SET
.status,
SET
.note,
SET
."createdBy",
SET
."createdAt",
SET
."updatedBy",
SET
."updatedAt",
SET
."userId",
SET
."completedAt",
  COALESCE(a."soldAt", l."soldAt") AS "soldAt",
  (
    ((pb.name) :: text || ' ' :: text) || (p.model) :: text
  ) AS product,
  a."serialNo" AS "applianceSerialNo",
  (
    (
      (
        ((lb.name) :: text || ' ' :: text) || (lt.type) :: text
      ) || ' ' :: text
    ) || lt.duration
  ) AS "licenseType",
  COALESCE(al."serialNo", l."serialNo") AS "licenseSerialNo",
  u.name AS "assignedUser",
  CASE
    WHEN (
      (c.name IS NOT NULL)
      AND (COALESCE(a."cusName", l."cusName") IS NOT NULL)
      AND (
        (COALESCE(a."cusName", l."cusName")) :: text <> '' :: text
      )
    ) THEN (
      (
        (
          ((c.name) :: text || '(' :: text) || (COALESCE(a."cusName", l."cusName")) :: text
        ) || ')' :: text
      )
    ) :: character varying
    WHEN (c.name IS NULL) THEN COALESCE(a."cusName", l."cusName")
    ELSE c.name
  END AS "customerName",
  d.name AS "dealerName",
  sd.name AS "subDealerName",
  s.name AS "supplierName"
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
                      (
                        (
                          setups
                          SET
                            LEFT JOIN users u ON (
                              (
                                SET
."userId" = u.id
                              )
                            )
                        )
                        LEFT JOIN appliances a ON (
                          (
                            SET
."applianceId" = a.id
                          )
                        )
                      )
                      LEFT JOIN products p ON ((a."productId" = p.id))
                    )
                    LEFT JOIN brands pb ON ((p."brandId" = pb.id))
                  )
                  LEFT JOIN LATERAL (
                    SELECT
                      al_1.id,
                      al_1.active,
                      al_1."startDate",
                      al_1."expiryDate",
                      al_1."createdBy",
                      al_1."createdAt",
                      al_1."updatedBy",
                      al_1."boughtAt",
                      al_1."soldAt",
                      al_1."dealerId",
                      al_1."licenseTypeId",
                      al_1."supplierId",
                      al_1."updatedAt",
                      al_1."customerId",
                      al_1.deleted,
                      al_1."serialNo",
                      al_1."applianceId",
                      al_1."subDealerId",
                      al_1."boughtTypeId",
                      al_1.note,
                      al_1."orderedAt",
                      al_1."appSerialNo",
                      al_1."productId",
                      al_1."cusName",
                      al_1."isLost",
                      al_1."isPassive",
                      al_1."mailSended",
                      al_1."invoiceCurrentId"
                    FROM
                      licenses al_1
                    WHERE
                      (al_1."applianceId" = a.id)
                    ORDER BY
                      al_1."createdAt" DESC
                    LIMIT
                      1
                  ) al ON (TRUE)
                )
                LEFT JOIN licenses l ON (
                  (
                    SET
."licenseId" = l.id
                  )
                )
              )
              LEFT JOIN "licenseTypes" lt ON (
                (
                  COALESCE(al."licenseTypeId", l."licenseTypeId") = lt.id
                )
              )
            )
            LEFT JOIN brands lb ON ((lt."brandId" = lb.id))
          )
          LEFT JOIN currents c ON (
            (COALESCE(a."customerId", l."customerId") = c.id)
          )
        )
        LEFT JOIN currents d ON ((COALESCE(a."dealerId", l."dealerId") = d.id))
      )
      LEFT JOIN currents sd ON (
        (
          COALESCE(a."subDealerId", l."subDealerId") = sd.id
        )
      )
    )
    LEFT JOIN currents s ON (
      (COALESCE(a."supplierId", l."supplierId") = s.id)
    )
  );