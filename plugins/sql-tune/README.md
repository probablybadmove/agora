# sql-tune

Explain what a SQL query does in plain English, then make it faster. `sql-tune` is a dialect-aware
Claude Code skill that reads a query (raw SQL, a `.sql` file, or even ORM/app code), explains its
behavior, and surfaces the optimizations that actually matter: missing indexes, sargability
problems, N+1 patterns, and a drop-in rewritten query.

## What it does

- **Plain-English explanation** — the result grain, the join graph, filters, and any subtle
  behavior (a `LEFT JOIN` quietly acting as an `INNER JOIN`, a `DISTINCT` masking a fan-out, etc.).
- **Dialect detection** — PostgreSQL, MySQL/MariaDB, SQL Server (T-SQL), Oracle, Snowflake,
  BigQuery, and SQLite, so the advice and rewrite use the right syntax.
- **Optimization findings**, ordered by impact:
  - Missing / composite / covering indexes (equality → range → sort column ordering).
  - Sargability fixes (functions on indexed columns, leading-wildcard `LIKE`, implicit casts, `OR` splits).
  - N+1 detection when the input is ORM or application code.
  - `SELECT *`, deep `OFFSET` pagination, `COUNT(*)` existence checks, correlated subqueries, and more.
- **A rewritten query** that returns identical results, plus the exact `EXPLAIN` command to confirm the win.

It reads nearby schema/migration files when available to verify columns and existing indexes before
recommending new ones, and it never executes the SQL you hand it.

## Invocation

```
/sql-tune:explain-sql <your SQL, a path to a .sql file, or a paste of ORM code>
```

You can name the dialect to skip detection, e.g. `/sql-tune:explain-sql [postgres] SELECT ...`.

## Example

```
/sql-tune:explain-sql
SELECT * FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE DATE(o.created_at) = '2024-01-01'
  AND c.country = 'IN'
ORDER BY o.total DESC
LIMIT 20;
```

Produces:

- **What it does** — the 20 highest-value orders placed on 2024-01-01 belonging to customers in India.
- **Dialect** — PostgreSQL (inferred from `LIMIT` + `DATE()` usage).
- **Findings** — `DATE(o.created_at) = ...` is non-sargable (wrap defeats any index on `created_at`);
  `SELECT *` blocks a covering index; no index supports the `country` filter or the `total` sort.
- **Suggested indexes** —
  ```sql
  CREATE INDEX idx_customers_country ON customers (country);
  CREATE INDEX idx_orders_customer_created ON orders (customer_id, created_at);
  ```
- **Rewritten query** — replaces the `DATE()` wrap with a half-open range
  (`created_at >= '2024-01-01' AND created_at < '2024-01-02'`) and selects only the needed columns.
- **Next step** — `EXPLAIN ANALYZE` the rewrite to confirm an index scan replaced the seq scan.

## License

MIT © [Gagan Singh](https://gagansingh.tech)
