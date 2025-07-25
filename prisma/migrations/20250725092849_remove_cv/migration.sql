/*
  Warnings:

  - You are about to drop the `cvs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cvs" DROP CONSTRAINT "fk_roles_c_vs";

-- DropForeignKey
ALTER TABLE "cvs" DROP CONSTRAINT "fk_users_c_vs";

-- DropTable
DROP TABLE "cvs";
