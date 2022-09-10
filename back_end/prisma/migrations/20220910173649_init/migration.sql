-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "intraName" TEXT,
    "hash" TEXT,
    "twoFactorAuth" BOOLEAN NOT NULL,
    "twoFactorSecret" TEXT,
    "status" INTEGER NOT NULL,
    "friends" INTEGER[],
    "blocked" INTEGER[],
    "channels" TEXT[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channels" (
    "name" TEXT NOT NULL,
    "admins" INTEGER[],
    "hash" TEXT,
    "isDmChannel" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_intraName_key" ON "users"("intraName");

-- CreateIndex
CREATE UNIQUE INDEX "channels_name_key" ON "channels"("name");
