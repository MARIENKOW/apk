-- CreateTable
CREATE TABLE "app_form_data" (
    "id" TEXT NOT NULL,
    "checkboxText" TEXT NOT NULL DEFAULT 'я понимаю, что будет списан 1 шекель в целях бесплатной доставки для проверки счёта, сумма будет возвращена.',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_form_data_pkey" PRIMARY KEY ("id")
);
