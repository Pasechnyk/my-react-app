import {Button, Divider, Form, Input, Upload, message, Alert} from "antd";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import type {UploadChangeParam} from 'antd/es/upload';
import type {RcFile, UploadFile, UploadProps} from 'antd/es/upload/interface';
import {ICategoryCreate} from "./types.ts";
import http_common from "../../../http_common.ts";

const CategoryCreatePage = () => {

    // Коментування
    const navigate = useNavigate(); // Навігаційний хук між сторінками
    const [file, setFile] = useState<File | null>(null); // Керування вибраним файлом
    const [errorMessage, setErrorMessage] = useState<string>(""); // Керування повідомлень про помилки
    const [loading, setLoading] = useState(false); // Керування станом під час завантаження файлу

    // Активуємо функцію при успішному завантаженні форми
    const onFinish = async (values: any) => {
        console.log('Success:', values); // Вивід значень
        console.log('file:', file); // Вивід обраного файлу

        if(file==null) {
            setErrorMessage("Оберіть фото!");
            return;
        }
        // Модель для створення нової категорії
        const model : ICategoryCreate = {
            name: values.name,
            image: file
        };
        try {
            // Відправляємо запит POST для створення категорії на сервері
            await http_common.post("/api/categories/create", model,{
                headers: {
                    "Content-Type": "multipart/form-data" // Вказуємо тип контенту дял завантаження файлу
                }
            });
            // Повернення до домашньої сторінки після успішного виконання коду
            navigate("/");
        }
        catch (ex) {
            message.error('Помилка створення категорії!');
        }
    }
    // Вивід помилки при невдалому виконанні
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        name?: string;
    };

    const customDividerStyle = {
        borderTop: '2px solid #1890ff',
        margin: '5px 0 50px 0',
    };

    // Функція для обробки змін завантаження файлу
    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        // Перевіряємо чи файл вже завантажується
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        // Перевіряємо чи завантаження закінчилось
        if (info.file.status === 'done') {
            const file = info.file.originFileObj as File; //Отримуємо завантажений файл в форматі File
            setLoading(false);
            setFile(file);
            setErrorMessage("");
        }
    };

    // Вигляд кнопки завантаження
    const uploadButton = (
        // Використовуємо тернарний оператор який відображає лічильник завантаження
        // або піктограму з плюсом на основі стану завантаження
        <div>
            {loading ? <LoadingOutlined/> : <PlusOutlined/>}
            <div style={{marginTop: 8}}>Upload</div>
        </div>
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

    return (
        <>
            <Divider style={customDividerStyle}>Додати категорію</Divider>
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
                    rules={[{required: true, message: 'Вкажіть назву категорії!'}]}
                >
                    <Input/>
                </Form.Item>


                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    accept={"image/*"}
                >
                    {file ? <img src={URL.createObjectURL(file)} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                </Upload>

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Додати
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default CategoryCreatePage;