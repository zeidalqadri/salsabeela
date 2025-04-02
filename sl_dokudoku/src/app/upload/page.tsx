import { FileUploader } from '@/components/file-uploader'

export default function UploadPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Upload New Documents</h1>
      <div className="max-w-2xl mx-auto">
        <FileUploader />
      </div>
      {/* TODO: Add section to show recently uploaded documents or link back to document list */}
    </div>
  )
}
