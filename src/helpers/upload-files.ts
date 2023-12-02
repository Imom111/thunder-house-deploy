
import fileUpload from "express-fileupload";
import path from "path";
import { v4 as uuidv4 } from "uuid";


export const uploadFiles = (
  files: fileUpload.UploadedFile | fileUpload.UploadedFile[],
  allowedExtensions = ["png", "jpg", "jpeg", "gif"],
  folder = ""
) => {
  return new Promise<string[]>((resolve, reject) => {
    const uploadedFiles = Array.isArray(files) ? files : [files];

    if (uploadedFiles.length === 0) {
      return reject("No files were received");
    }

    const results: string[] = [];

    uploadedFiles.forEach((uploadedFile) => {
      const fileNameParts = uploadedFile.name.split(".");
      const fileExtension =
        fileNameParts[fileNameParts.length - 1].toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        return reject(
          `The extension ${fileExtension} is not allowed - Allowed extensions: ${allowedExtensions.join(
            ", "
          )}`
        );
      }

      const temporaryFileName = uuidv4() + "." + fileExtension;
      const uploadPath = path.join(
        __dirname,
        "../uploads/",
        folder,
        temporaryFileName
      );

      uploadedFile.mv(uploadPath, (err: Error) => {
        if (err) {
          return reject(err);
        }
        results.push(temporaryFileName);

        if (results.length === uploadedFiles.length) {
          resolve(results);
        }
      });
    });
  });
};
