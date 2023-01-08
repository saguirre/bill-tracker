import { CloudArrowUpIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { createRef, useRef, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useKeyPress } from '../../hooks/useKeyPress.hook';
import { Cropper, ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface UploadAvatarModalProps {
  userId?: number;
}

interface FormValues {
  name: string;
}
const file2Base64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() || '');
    reader.onerror = (error) => reject(error);
  });
};

export const UploadAvatarModal: React.FC<UploadAvatarModalProps> = ({ userId }) => {
  const closeRef = useRef<HTMLInputElement>(null);
  const fileRef = createRef<HTMLInputElement>();
  const cropperRef = createRef<ReactCropperElement>();
  const [uploaded, setUploaded] = useState(null as string | null);
  const [cropped, setCropped] = useState(null as string | null);

  useKeyPress(
    () => {
      if (closeRef.current) {
        closeRef.current.checked = false;
      }
    },
    ['Escape'],
    false
  );

  const onFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target?.files?.[0];
    if (file) {
      file2Base64(file).then((base64) => {
        setUploaded(base64);
      });
    }
  };

  const onCrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    setCropped(cropper.getCroppedCanvas().toDataURL());
  };

  const resetCrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setCropped(null);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    try {
      const modal = document.getElementById('upload-avatar-modal') as any;
      if (modal) modal.checked = false;
      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('There was an error uploading your photo. Please try again later.');
    }
  };

  return (
    <>
      <input ref={closeRef} type="checkbox" id="upload-avatar-modal" className="modal-toggle" />
      <label htmlFor="upload-avatar-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <div className="flex flex-col items-start justify-start gap-2">
            <div className="flex flex-row items-center justify-start gap-2">
              <div className="border rounded-box p-1.5">
                <PhotoIcon className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-semibold">Upload Photo</h1>
            </div>
            <span className="text-base-content text-sm font-normal">Upload a photo for your profile.</span>
          </div>
          <div className="divider my-1.5"></div>
          <div className="flex flex-col items-start justify-center space-y-3">
            {!uploaded ? (
              <label className="w-full p-4 rounded-box hover:border-primary hover:border-solid cursor-pointer border border-base-content/40 border-dashed">
                <div
                  className="flex flex-row items-center justify-center gap-2"
                  onClick={() => fileRef.current?.click()}
                >
                  <input
                    id="input-file"
                    className="hidden"
                    type="file"
                    ref={fileRef}
                    onChange={onFileInputChange}
                    accept="image/png,image/jpeg,image/gif"
                  />
                  <CloudArrowUpIcon className="h-6 w-6" />
                  <h1 className="text-regular font-semibold">Click over here</h1>
                </div>
              </label>
            ) : (
              <div className="flex flex-col items-center w-full pt-4 justify-center gap-2">
                <div className="rounded-xl bg-base-100 p-2 border-2 border-ghost">
                  {!cropped && (
                    <Cropper
                      src={uploaded}
                      style={{ height: 288, width: 288 }}
                      autoCropArea={1}
                      aspectRatio={1}
                      viewMode={3}
                      guides={false}
                      ref={cropperRef}
                    />
                  )}
                  {cropped && (
                    <img src={cropped} className="rounded-full border-2 w-72 border-primary" alt="Cropped!" />
                  )}
                </div>
                {!cropped && (
                  <label onClick={onCrop} className="btn btn-md btn-primary">
                    Crop
                  </label>
                )}
                {cropped && (
                  <label onClick={resetCrop} className="btn btn-md btn-outline btn-primary">
                    Try again
                  </label>
                )}
              </div>
            )}
          </div>

          <div className="modal-action flex flex-row items-center justify-end">
            <label htmlFor="upload-avatar-modal" className="btn btn-ghost rounded-xl">
              Cancel
            </label>
            <button className="btn btn-primary rounded-xl">Save</button>
          </div>
        </label>
      </label>
    </>
  );
};
