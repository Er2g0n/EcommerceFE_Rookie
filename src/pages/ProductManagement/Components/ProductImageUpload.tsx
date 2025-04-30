import { useEffect, useState } from 'react';
import { Upload, Image, message } from 'antd';
import type { UploadFile, UploadProps, GetProp } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ProductImage } from '../../../types/ProductManagement/ProductImage/ProductImage';
import { Product } from '../../../types/ProductManagement/Product/Product';
import { getImagesByProductCode } from '../../../services/ProductManagement/Product.Service/productService';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file as Blob);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface ProductImageUploadProps {
  currentProduct: Product | null;
  onUploadSuccess?: (images: ProductImage[]) => void;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({ currentProduct, onUploadSuccess }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Fetch images from DB when editing product
  useEffect(() => {
    const fetchImages = async () => {
      if (currentProduct?.productCode) {
        try {
          const response = await getImagesByProductCode(currentProduct.productCode);
          if (response.code === '0' && response.data) {
            const images = response.data as ProductImage[];
            const mappedFiles = images.map((img, index) => ({
              uid: img.id ? img.id.toString() : `-${index}`,
              name: img.imagePath?.split('/').pop() || `Image ${index + 1}`,
              status: 'done' as const,
              url: img.imagePath,
            }));
            setFileList(mappedFiles);

            if (onUploadSuccess) {
              onUploadSuccess(images);
            }
          } else {
            message.error('Failed to load product images');
            setFileList([]);
          }
        } catch (error) {
          message.error('Error fetching images: ' + (error instanceof Error ? error.message : 'Unknown error'));
          setFileList([]);
        }
      } else {
        setFileList([]); // Nếu chưa có productCode thì clear list
      }
    };

    fetchImages();
  }, [currentProduct, onUploadSuccess]);

  // Preview logic
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // Khi upload hoặc remove file
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Button Upload
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <>
      <Upload
        action="http://localhost:28977/api/ProductImage/SaveImage" // ✅ Dùng đúng API duy nhất
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        multiple
        maxCount={8}
        showUploadList={{ showRemoveIcon: true, showPreviewIcon: true }}
        customRequest={({ file, onSuccess, onError }) => {
          if (!currentProduct?.productCode) {
            message.error('Product code is required');
            onError?.(new Error('Product code is required'));
            return;
          }

          const formData = new FormData();
          formData.append('text', currentProduct.productCode);
          formData.append('formFiles', file as File);

          fetch('http://localhost:28977/api/ProductImage/SaveImage', {
            method: 'POST',
            body: formData,
          })
            .then(async (response) => {
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors?.text?.[0] || 'Upload failed');
              }
              return response.json();
            })
            .then(() => {
              message.success('Upload successful');
              onSuccess?.('ok');
              // Sau khi upload thành công, tự reload lại hình nếu cần
              // hoặc thêm ảnh mới vào fileList
            })
            .catch((error) => {
              message.error(error instanceof Error ? error.message : 'Upload failed');
              onError?.(error as Error);
            });
        }}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>

      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default ProductImageUpload;
