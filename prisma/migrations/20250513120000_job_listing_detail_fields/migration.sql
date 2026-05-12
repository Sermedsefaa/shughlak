-- AlterTable
ALTER TABLE "JobListing" ADD COLUMN "longDescription" TEXT;
ALTER TABLE "JobListing" ADD COLUMN "coverImageUrl" TEXT;
ALTER TABLE "JobListing" ADD COLUMN "galleryUrls" TEXT;
ALTER TABLE "JobListing" ADD COLUMN "contactPreference" TEXT NOT NULL DEFAULT 'BOTH';
