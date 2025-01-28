SELECT
  c.id,
  c.ip,
  c.login,
  c.password,
  c.note,
  c."createdBy",
  c."createdAt",
  c."updatedBy",
  c."updatedAt",
  cu.name AS "customerName",
  b.name AS "brandName",
  c.controlled,
  ch."createdAt" AS "lastControlledAt"
FROM
  (
    (
      (
        connections c
        LEFT JOIN currents cu ON ((c."customerId" = cu.id))
      )
      LEFT JOIN brands b ON ((c."brandId" = b.id))
    )
    LEFT JOIN (
      SELECT
        DISTINCT ON ("connectionControlHistory"."connectionId") "connectionControlHistory"."connectionId",
        "connectionControlHistory"."createdAt"
      FROM
        "connectionControlHistory"
      ORDER BY
        "connectionControlHistory"."connectionId",
        "connectionControlHistory"."createdAt" DESC
    ) ch ON ((c.id = ch."connectionId"))
  );