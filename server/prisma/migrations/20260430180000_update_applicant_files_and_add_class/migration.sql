-- AddColumn kelas and semester to users
ALTER TABLE `users` ADD COLUMN `kelas` VARCHAR(191) NULL;
ALTER TABLE `users` ADD COLUMN `semester` INT NULL;

-- DropColumn file_pdf and add three new file columns to applicants
ALTER TABLE `applicants` DROP COLUMN `file_pdf`;
ALTER TABLE `applicants` ADD COLUMN `file_transkip` VARCHAR(191) NOT NULL DEFAULT '';
ALTER TABLE `applicants` ADD COLUMN `file_foto` VARCHAR(191) NOT NULL DEFAULT '';
ALTER TABLE `applicants` ADD COLUMN `file_formulir` VARCHAR(191) NOT NULL DEFAULT '';
