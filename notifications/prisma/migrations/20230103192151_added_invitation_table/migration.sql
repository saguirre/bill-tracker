-- CreateTable
CREATE TABLE "Invitation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subject" TEXT NOT NULL,
    "body" TEXT,
    "recipientEmail" TEXT NOT NULL,
    "replyTo" TEXT,
    "recipientName" TEXT,
    "senderEmail" TEXT NOT NULL,
    "senderName" TEXT,
    "sentAt" TIMESTAMP(3),
    "context" TEXT,
    "error" VARCHAR(255),
    "sent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);
