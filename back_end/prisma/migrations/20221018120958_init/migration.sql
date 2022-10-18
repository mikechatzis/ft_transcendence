-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "intraName" TEXT,
    "avatar" TEXT NOT NULL DEFAULT './images/avatars/default.jpg',
    "rank" TEXT DEFAULT 'hatchling',
    "score" INTEGER NOT NULL DEFAULT 1000,
    "hash" TEXT,
    "twoFactorAuth" BOOLEAN NOT NULL,
    "twoFactorSecret" TEXT,
    "refreshToken" TEXT,
    "status" INTEGER NOT NULL,
    "friends" INTEGER[],
    "blocked" INTEGER[],
    "channels" TEXT[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "opponentId" INTEGER NOT NULL,
    "winner" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channels" (
    "name" TEXT NOT NULL,
    "admins" INTEGER[],
    "messages" JSONB[],
    "hash" TEXT,
    "isDmChannel" BOOLEAN NOT NULL,
    "isPrivate" BOOLEAN NOT NULL,
    "muted" INTEGER[],
    "blocked" INTEGER[]
);

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_intraName_key" ON "users"("intraName");

-- CreateIndex
CREATE UNIQUE INDEX "users_refreshToken_key" ON "users"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "channels_name_key" ON "channels"("name");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
