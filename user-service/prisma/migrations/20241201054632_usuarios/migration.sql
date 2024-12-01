-- CreateTable
CREATE TABLE "Usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_usuario_key" ON "Usuarios"("usuario");
