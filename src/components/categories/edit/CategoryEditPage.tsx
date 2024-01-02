import React, { useEffect, useState } from "react";
import { Button, Divider, Form, Input, Upload, message, Alert } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import http_common from "../../../http_common.ts";
import {ICategoryEdit} from "./types.ts";

const CategoryEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState<ICategoryEdit | null>(null);
    const [loadingCategory, setLoadingCategory] = useState(true);

    useEffect(() => {
        setLoadingCategory(true);
        // Витягнення даних по ID
        http_common.get(`/api/categories/${id}`)
            .then(resp => {
                setCategory(resp.data);
                setLoadingCategory(false);
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    // Вивід помилки 404 Not Found
                    console.error('Category not found:', error.response.data);
                    setErrorMessage("Категорію не знайдено");
                } else {
                    console.error('Error fetching category:', error.response.data);
                    setErrorMessage("Помилка завантаження категорії");
                }
                setLoadingCategory(false);
            });
    }, [id]);

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        console.log('file:', file);
        if (file == null) {
            setErrorMessage("Оберіть фото!");
            return;
        }
        const model: ICategoryEdit = {
            name: values.name,
            image: file
        };
        try {
            // Оновлення даних новими значеннями
            await http_common.post(`/api/categories/edit/${id}`, model, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            navigate("/");
        }
        catch (ex) {
            message.error('Помилка оновлення категорії!');
        }
    }

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
            {loadingCategory && <p>Loading...</p>}
            <Divider style={customDividerStyle}>Редагувати категорію</Divider>
            {errorMessage && <Alert message={errorMessage} style={{ marginBottom: "20px" }} type="error" />}
            <Form
                name="basic"
                style={{ maxWidth: 1000 }}
                initialValues={{ remember: true, name: category?.name }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Назва"
                    name="name"
                    rules={[{ required: true, message: 'Вкажіть назву категорії!' }]}
                >
                    <Input />
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

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Оновити
                    </Button>
                    <Button onClick={() => navigate("/")}>
                        Скасувати
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default CategoryEditPage;
