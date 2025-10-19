import FileUpload from '../FileUpload';

export default function FileUploadExample() {
  return (
    <div className="p-4 max-w-2xl">
      <FileUpload onFileSelect={(file) => console.log('File:', file.name)} />
    </div>
  );
}
