//@ts-ignore
import {Button, Divider, Form, Input, UploadFile, Alert, GetProp, UploadProps, Upload, Modal, message} from "antd";
import {useState} from "react";
import { PlusOutlined } from '@ant-design/icons';
import {RcFile} from "antd/es/upload/interface";

const ProductCreatePage = () => {

    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [errorMessage , setErrorMessage] = useState<string>("");

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            // @ts-ignore
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    // Викликаємо функцію валідації перед завантаженням файлу
    const beforeUpload = (file: RcFile) => {
        // Перевіряємо чи це картинка
        const isImage = /^image\/\w+/.test(file.type);
        if (!isImage) {
            message.error('Оберіть файл зображення!');
        }
        // Перевіряємо чи файл менше 10мб
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('Розмір файлу не повинен перевищувать 10MB!');
        }
        // Інформуємо чи файл обраний та відповідає критеріям
        console.log("is select", isImage && isLt2M);
        return isImage && isLt2M;
    };


    const onFinish = async (values: any) => {
        console.log('Success:', values);
        console.log("Select files", fileList);

        // Перевірка на наявність файлів
        if(fileList==null) {
            setErrorMessage("Оберіть фото!");
            return;
        }
    }

    // Вивід помилки при невдалому виконанні
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        name?: string;
    };

    return (
        <>
            <Divider>Додати товар</Divider>
            {errorMessage && <Alert message={errorMessage} style={{marginBottom: "20px"}} type="error" />}
            <Form
                name="basic"
                style={{maxWidth: 1000}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Назва"
                    name="name"
                    rules={[{required: true, message: 'Вкажіть назву товару!'}]}
                >
                    <Input/>
                </Form.Item>

                <Upload
                    // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    beforeUpload={beforeUpload}
                    listType="picture-card"
                    fileList={fileList}
                    multiple
                    onPreview={handlePreview}
                    onChange={handleChange}
                    accept="image/*"
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Додати товар
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default ProductCreatePage;