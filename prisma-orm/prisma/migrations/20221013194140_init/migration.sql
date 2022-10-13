-- CreateEnum
CREATE TYPE "QueryType" AS ENUM ('SELECT', 'WHERE', 'JOIN');

-- CreateTable
CREATE TABLE "customers" (
    "id" VARCHAR(5) NOT NULL,
    "company_name" VARCHAR NOT NULL,
    "contact_name" VARCHAR NOT NULL,
    "contact_title" VARCHAR NOT NULL,
    "address" VARCHAR NOT NULL,
    "city" VARCHAR NOT NULL,
    "postal_code" VARCHAR,
    "region" VARCHAR,
    "country" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "fax" VARCHAR,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "first_name" VARCHAR,
    "title" VARCHAR NOT NULL,
    "title_of_courtesy" VARCHAR NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "hire_date" TIMESTAMP(3) NOT NULL,
    "address" VARCHAR NOT NULL,
    "city" VARCHAR NOT NULL,
    "postal_code" VARCHAR NOT NULL,
    "country" VARCHAR NOT NULL,
    "home_phone" VARCHAR NOT NULL,
    "extension" INTEGER NOT NULL,
    "notes" VARCHAR NOT NULL,
    "recipient_id" VARCHAR,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" VARCHAR NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL,
    "required_date" TIMESTAMP(3) NOT NULL,
    "shipped_date" TIMESTAMP(3),
    "ship_via" INTEGER NOT NULL,
    "freight" DECIMAL(10,2) NOT NULL,
    "ship_name" VARCHAR NOT NULL,
    "ship_city" VARCHAR NOT NULL,
    "ship_region" VARCHAR,
    "ship_postal_code" VARCHAR,
    "ship_country" VARCHAR NOT NULL,
    "customer_id" VARCHAR NOT NULL,
    "employee_id" VARCHAR NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_details" (
    "unit_price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL,
    "order_id" VARCHAR NOT NULL,
    "product_id" VARCHAR NOT NULL,

    CONSTRAINT "order_details_pkey" PRIMARY KEY ("order_id","product_id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "qt_per_unit" VARCHAR NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "units_in_stock" INTEGER NOT NULL,
    "units_on_order" INTEGER NOT NULL,
    "reorder_level" INTEGER NOT NULL,
    "discontinued" INTEGER NOT NULL,
    "supplier_id" VARCHAR NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" VARCHAR NOT NULL,
    "company_name" VARCHAR NOT NULL,
    "contact_name" VARCHAR NOT NULL,
    "contact_title" VARCHAR NOT NULL,
    "address" VARCHAR NOT NULL,
    "city" VARCHAR NOT NULL,
    "region" VARCHAR,
    "postal_code" VARCHAR NOT NULL,
    "country" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metrics" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "ms" INTEGER NOT NULL,
    "type" "QueryType" NOT NULL DEFAULT 'SELECT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metrics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
